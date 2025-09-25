import { NextRequest } from "next/server";
import { sql, and, or, ilike, gte, lte, asc, desc } from "drizzle-orm";
import db from "../../../db";
import { advocates } from "../../../db/schema";
import { advocateData } from "../../../db/seed/advocates";
import { AdvocateQueryParams, PaginatedResponse, Advocate } from "../../../lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Parse query parameters
  const params: AdvocateQueryParams = {
    page: parseInt(searchParams.get('page') || '1'),
    limit: parseInt(searchParams.get('limit') || '10'),
    city: searchParams.get('city') || undefined,
    degree: searchParams.get('degree') || undefined,
    specialty: searchParams.get('specialty') || undefined,
    minExperience: searchParams.get('minExperience') ? parseInt(searchParams.get('minExperience')!) : undefined,
    maxExperience: searchParams.get('maxExperience') ? parseInt(searchParams.get('maxExperience')!) : undefined,
    search: searchParams.get('search') || undefined,
    sortBy: (searchParams.get('sortBy') as keyof Advocate) || 'firstName',
    sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'asc',
  };

  // Validate pagination params
  const page = Math.max(1, params.page || 1);
  const limit = Math.min(100, Math.max(1, params.limit || 10)); // Max 100 items per page
  const offset = (page - 1) * limit;

  try {
    // Build where conditions
    const conditions = [];

    if (params.city) {
      conditions.push(ilike(advocates.city, `%${params.city}%`));
    }

    if (params.degree) {
      conditions.push(ilike(advocates.degree, `%${params.degree}%`));
    }

    if (params.specialty) {
      // Use text search on JSON payload to find specialty
      conditions.push(sql.raw(`payload::text ILIKE '%${params.specialty}%'`));
    }

    if (params.minExperience !== undefined) {
      conditions.push(gte(advocates.yearsOfExperience, params.minExperience));
    }

    if (params.maxExperience !== undefined) {
      conditions.push(lte(advocates.yearsOfExperience, params.maxExperience));
    }

    if (params.search) {
      conditions.push(
        or(
          ilike(advocates.firstName, `%${params.search}%`),
          ilike(advocates.lastName, `%${params.search}%`),
          ilike(advocates.city, `%${params.search}%`),
          ilike(advocates.degree, `%${params.search}%`)
        )
      );
    }

    // Build order clause
    const orderColumn = advocates[params.sortBy!] || advocates.firstName;
    const orderDirection = params.sortOrder === 'desc' ? desc(orderColumn) : asc(orderColumn);

    // Execute query with filters, sorting, and pagination
    const data = conditions.length > 0
      ? await db.select().from(advocates).where(and(...conditions)).orderBy(orderDirection).limit(limit).offset(offset)
      : await db.select().from(advocates).orderBy(orderDirection).limit(limit).offset(offset);

    // Get total count by fetching all matching records (not ideal for large datasets, but works for type safety)
    const allRecords = conditions.length > 0
      ? await db.select().from(advocates).where(and(...conditions))
      : await db.select().from(advocates);
    const total = allRecords.length;
    const totalPages = Math.ceil(total / limit);

    const response: PaginatedResponse<Advocate> = {
      data: data as Advocate[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };

    return Response.json(response);
  } catch (error) {
    console.error('Error fetching advocates:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

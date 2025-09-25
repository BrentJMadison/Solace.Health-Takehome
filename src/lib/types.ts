export interface Advocate {
  id: number;
  firstName: string;
  lastName: string;
  city: string;
  degree: 'MD' | 'PhD' | 'MSW';
  specialties: string[];
  yearsOfExperience: number;
  phoneNumber: number;
  createdAt?: Date;
}

export interface AdvocateFilters {
  city?: string;
  degree?: string;
  specialty?: string;
  minExperience?: number;
  maxExperience?: number;
  search?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: keyof Advocate;
  sortOrder?: 'asc' | 'desc';
}

export interface AdvocateQueryParams extends AdvocateFilters, PaginationParams, SortParams {}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
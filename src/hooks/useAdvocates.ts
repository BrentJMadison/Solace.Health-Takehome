import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';
import { Advocate, AdvocateQueryParams, PaginatedResponse } from '@/lib/types';

interface UseAdvocatesReturn {
  data: Advocate[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  refetch: () => void;
  updateFilters: (params: Partial<AdvocateQueryParams>) => void;
  currentFilters: AdvocateQueryParams;
}

export function useAdvocates(initialParams: AdvocateQueryParams = {}): UseAdvocatesReturn {
  const [data, setData] = useState<Advocate[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);
  const [currentFilters, setCurrentFilters] = useState<AdvocateQueryParams>({
    page: 1,
    limit: 10,
    sortBy: 'firstName',
    sortOrder: 'asc',
    ...initialParams,
  });

  const fetchAdvocates = useCallback(async (params: AdvocateQueryParams) => {
    setLoading(true);
    setError(null);

    try {
      const searchParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          searchParams.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/advocates?${searchParams.toString()}`);

      if (!response.ok) {
        throw new Error('Failed to fetch advocates');
      }

      const result: PaginatedResponse<Advocate> = await response.json();

      setData(result.data);
      setPagination(result.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setData([]);
      setPagination(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const debouncedFetch = useCallback(
    debounce((params: AdvocateQueryParams) => {
      fetchAdvocates(params);
    }, 300),
    [fetchAdvocates]
  );

  const updateFilters = useCallback((newParams: Partial<AdvocateQueryParams>) => {
    const updatedFilters = { ...currentFilters, ...newParams };

    // Reset to page 1 when filters change (except when explicitly changing page)
    if (!newParams.hasOwnProperty('page')) {
      updatedFilters.page = 1;
    }

    setCurrentFilters(updatedFilters);

    // Use debounced fetch for search, immediate for other filters
    if (newParams.search !== undefined) {
      debouncedFetch(updatedFilters);
    } else {
      fetchAdvocates(updatedFilters);
    }
  }, [currentFilters, debouncedFetch, fetchAdvocates]);

  const refetch = useCallback(() => {
    fetchAdvocates(currentFilters);
  }, [currentFilters, fetchAdvocates]);

  useEffect(() => {
    fetchAdvocates(currentFilters);
  }, []);

  return {
    data,
    loading,
    error,
    pagination,
    refetch,
    updateFilters,
    currentFilters,
  };
}
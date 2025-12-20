// src/shared/hooks/useBooks.ts
import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

interface UseBooksParams {
  page: number;
  limit: number;
  search?: string;
  fields?: string[];
  sort?: string;
}

export function useBooks(params: UseBooksParams) {
  // Debounce search internally
  const debouncedSearch = useDebounce(params.search, 500);
  
  return useQuery({
    queryKey: ['books', { 
      ...params, 
      search: debouncedSearch 
    }],
    queryFn: async () => {
      const queryParams = new URLSearchParams();
      
      queryParams.set('page', params.page.toString());
      queryParams.set('limit', params.limit.toString());
      
      if (debouncedSearch) queryParams.set('search', debouncedSearch);
      if (params.fields?.length) queryParams.set('fields', params.fields.join(','));
      if (params.sort) queryParams.set('sort', params.sort);
      
      const response = await fetch(`/api/books?${queryParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch books');
      }
      
      return response.json();
    },
  });
}
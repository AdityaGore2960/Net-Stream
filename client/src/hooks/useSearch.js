import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { searchMulti } from '../services/tmdb';

/**
 * Custom hook for debounced search
 * @param {string} query - Search query
 * @param {number} delay - Debounce delay in ms
 */
export const useSearch = (query, delay = 300) => {
  const [debouncedQuery, setDebouncedQuery] = useState(query);

  useEffect(() => {
    // Update debounced value after delay
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, delay);

    // Cancel the timeout if value changes (also on delay change or unmount)
    // This is how we prevent debounced value from updating if value is changed
    // within the delay period.
    return () => {
      clearTimeout(handler);
    };
  }, [query, delay]);

  const { data, isLoading, error } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1, // Only search if query is at least 2 chars
    staleTime: 5 * 60 * 1000,
  });

  return {
    results: data?.results || [],
    isLoading,
    error,
    hasResults: !!data?.results?.length,
  };
};

import { useQuery } from '@tanstack/react-query';
import * as tmdbApi from '../services/tmdb';

const STALE_TIME = 5 * 60 * 1000; // 5 minutes
const CACHE_TIME = 10 * 60 * 1000; // 10 minutes

/**
 * Hook to get trending content
 * @param {'movie'|'tv'} type - Type of content
 * @param {'day'|'week'} timeWindow - Time window
 */
export const useGetTrending = (type = 'movie', timeWindow = 'day') => {
  return useQuery({
    queryKey: ['trending', type, timeWindow],
    queryFn: () => type === 'movie' ? tmdbApi.getTrending(timeWindow) : tmdbApi.getTrendingTV(timeWindow),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get trending content across ALL types (movie + tv + person)
 * @param {'day'|'week'} timeWindow
 */
export const useGetTrendingAll = (timeWindow = 'day') => {
  return useQuery({
    queryKey: ['trendingAll', timeWindow],
    queryFn: () => tmdbApi.getTrendingAll(timeWindow),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get now playing movies
 * @param {number} page
 */
export const useGetNowPlaying = (page = 1) => {
  return useQuery({
    queryKey: ['nowPlaying', page],
    queryFn: () => tmdbApi.getNowPlaying(page),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get popular content
 * @param {'movie'|'tv'} type - Type of content
 * @param {number} page - Page number
 */
export const useGetPopular = (type = 'movie', page = 1) => {
  return useQuery({
    queryKey: ['popular', type, page],
    queryFn: () => type === 'movie' ? tmdbApi.getPopular(page) : tmdbApi.getPopularTV(page),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get top rated content
 * @param {'movie'|'tv'} type - Type of content
 * @param {number} page - Page number
 */
export const useGetTopRated = (type = 'movie', page = 1) => {
  return useQuery({
    queryKey: ['topRated', type, page],
    queryFn: () => type === 'movie' ? tmdbApi.getTopRated(page) : tmdbApi.getTopRatedTV(page),
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get content details
 * @param {'movie'|'tv'|'person'} type - Type of content
 * @param {string|number} id - Content ID
 */
export const useGetDetails = (type, id) => {
  return useQuery({
    queryKey: ['details', type, id],
    queryFn: () => {
      if (type === 'movie') return tmdbApi.getMovieDetails(id);
      if (type === 'tv') return tmdbApi.getTVDetails(id);
      if (type === 'person') return tmdbApi.getPersonDetails(id);
      throw new Error('Invalid type');
    },
    enabled: !!id && !!type,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get content by genre
 * @param {'movie'|'tv'} type - Type of content
 * @param {number} genreId - Genre ID
 * @param {number} page - Page number
 */
export const useGetByGenre = (type = 'movie', genreId, page = 1) => {
  return useQuery({
    queryKey: ['discover', type, genreId, page],
    queryFn: () => type === 'movie' ? tmdbApi.getMoviesByGenre(genreId, page) : tmdbApi.getTVByGenre(genreId, page),
    enabled: !!genreId,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });
};

/**
 * Hook to get watch providers
 * @param {'movie'|'tv'} type - Type of content
 * @param {string|number} id - Content ID
 */
export const useWatchProviders = (type, id) => {
  return useQuery({
    queryKey: ['watchProviders', type, id],
    queryFn: () => tmdbApi.getWatchProviders(type, id),
    enabled: !!id && !!type,
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
    retry: (failureCount, error) => {
      // Retry for 429 Too Many Requests (up to 3 times)
      if (error?.response?.status === 429 && failureCount < 3) {
        return true;
      }
      return false; // Don't retry other errors
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000), // Exponential backoff
  });
};

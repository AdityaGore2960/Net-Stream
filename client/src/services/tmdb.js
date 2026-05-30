import axios from 'axios';

// Get base URL and token from environment variables
const TMDB_BASE_URL = import.meta.env.VITE_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const TMDB_READ_TOKEN = import.meta.env.VITE_TMDB_READ_TOKEN;

/**
 * Axios instance for TMDB API requests
 */
const tmdbAxios = axios.create({
  baseURL: TMDB_BASE_URL,
  headers: {
    Authorization: `Bearer ${TMDB_READ_TOKEN}`,
    'Content-Type': 'application/json',
  },
  withCredentials: false,
});

// Request interceptor: log requests in development
tmdbAxios.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[TMDB API] Request: ${config.method.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: handle errors
tmdbAxios.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error('[TMDB API] Error 401: Unauthorized. Please check your API key/token.');
      } else if (status === 404) {
        console.error('[TMDB API] Error 404: Resource not found.');
      } else if (status === 429) {
        console.error('[TMDB API] Error 429: Rate limit exceeded. Too many requests.');
      } else {
        console.error(`[TMDB API] Error ${status}:`, error.response.data);
      }
    }
    return Promise.reject(error);
  }
);

/* =========================================================================
   MOVIES ENDPOINTS
   ========================================================================= */

/**
 * Get trending movies
 * @param {'day'|'week'} timeWindow - Time window for trending
 * @returns {Promise<Object>} Trending movies response
 */
export const getTrending = (timeWindow = 'day') => {
  return tmdbAxios.get(`/trending/movie/${timeWindow}`);
};

/**
 * Get trending content across all media types (movie + tv + person)
 * @param {'day'|'week'} timeWindow - Time window for trending
 * @returns {Promise<Object>} Trending all response
 */
export const getTrendingAll = (timeWindow = 'day') => {
  return tmdbAxios.get(`/trending/all/${timeWindow}`);
};

/**
 * Get now playing movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Now playing movies response
 */
export const getNowPlaying = (page = 1) => {
  return tmdbAxios.get(`/movie/now_playing?page=${page}`);
};

/**
 * Alias kept for clarity
 */
export const getNowPlayingMovies = (page = 1) => getNowPlaying(page);

/**
 * Get top rated movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Top rated movies response
 */
export const getTopRated = (page = 1) => {
  return tmdbAxios.get(`/movie/top_rated?page=${page}`);
};

/**
 * Get popular movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Popular movies response
 */
export const getPopular = (page = 1) => {
  return tmdbAxios.get(`/movie/popular?page=${page}`);
};

/**
 * Get upcoming movies
 * @param {number} page - Page number
 * @returns {Promise<Object>} Upcoming movies response
 */
export const getUpcoming = (page = 1) => {
  return tmdbAxios.get(`/movie/upcoming?page=${page}`);
};

/**
 * Get movie details by ID
 * @param {number|string} movieId - Movie ID
 * @returns {Promise<Object>} Movie details response
 */
export const getMovieDetails = (movieId) => {
  return tmdbAxios.get(`/movie/${movieId}?append_to_response=videos,credits,similar,recommendations,images`);
};

/**
 * Get movies by genre
 * @param {number|string} genreId - Genre ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Discover movies response
 */
export const getMoviesByGenre = (genreId, page = 1) => {
  return tmdbAxios.get(`/discover/movie?with_genres=${genreId}&page=${page}`);
};

/* =========================================================================
   TV SHOWS ENDPOINTS
   ========================================================================= */

/**
 * Get trending TV shows
 * @param {'day'|'week'} timeWindow - Time window for trending
 * @returns {Promise<Object>} Trending TV shows response
 */
export const getTrendingTV = (timeWindow = 'day') => {
  return tmdbAxios.get(`/trending/tv/${timeWindow}`);
};

/**
 * Get popular TV shows
 * @param {number} page - Page number
 * @returns {Promise<Object>} Popular TV shows response
 */
export const getPopularTV = (page = 1) => {
  return tmdbAxios.get(`/tv/popular?page=${page}`);
};

/**
 * Get top rated TV shows
 * @param {number} page - Page number
 * @returns {Promise<Object>} Top rated TV shows response
 */
export const getTopRatedTV = (page = 1) => {
  return tmdbAxios.get(`/tv/top_rated?page=${page}`);
};

/**
 * Get TV shows currently on air
 * @param {number} page - Page number
 * @returns {Promise<Object>} On air TV shows response
 */
export const getOnAirTV = (page = 1) => {
  return tmdbAxios.get(`/tv/on_the_air?page=${page}`);
};

/**
 * Get TV show details by ID
 * @param {number|string} tvId - TV show ID
 * @returns {Promise<Object>} TV show details response
 */
export const getTVDetails = (tvId) => {
  return tmdbAxios.get(`/tv/${tvId}?append_to_response=videos,credits,similar,recommendations`);
};

/**
 * Get TV shows by genre
 * @param {number|string} genreId - Genre ID
 * @param {number} page - Page number
 * @returns {Promise<Object>} Discover TV shows response
 */
export const getTVByGenre = (genreId, page = 1) => {
  return tmdbAxios.get(`/discover/tv?with_genres=${genreId}&page=${page}`);
};

/* =========================================================================
   SEARCH ENDPOINTS
   ========================================================================= */

/**
 * Search across multiple categories (movies, tv, person)
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Multi search response
 */
export const searchMulti = (query, page = 1) => {
  return tmdbAxios.get(`/search/multi?query=${encodeURIComponent(query)}&page=${page}`);
};

/**
 * Search movies
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Movie search response
 */
export const searchMovies = (query, page = 1) => {
  return tmdbAxios.get(`/search/movie?query=${encodeURIComponent(query)}&page=${page}`);
};

/**
 * Search TV shows
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} TV search response
 */
export const searchTV = (query, page = 1) => {
  return tmdbAxios.get(`/search/tv?query=${encodeURIComponent(query)}&page=${page}`);
};

/**
 * Search people
 * @param {string} query - Search query
 * @param {number} page - Page number
 * @returns {Promise<Object>} Person search response
 */
export const searchPerson = (query, page = 1) => {
  return tmdbAxios.get(`/search/person?query=${encodeURIComponent(query)}&page=${page}`);
};

/* =========================================================================
   GENRES ENDPOINTS
   ========================================================================= */

/**
 * Get official movie genres list
 * @returns {Promise<Object>} Movie genres response
 */
export const getMovieGenres = () => {
  return tmdbAxios.get('/genre/movie/list');
};

/**
 * Get official TV genres list
 * @returns {Promise<Object>} TV genres response
 */
export const getTVGenres = () => {
  return tmdbAxios.get('/genre/tv/list');
};

/* =========================================================================
   PERSON ENDPOINTS
   ========================================================================= */

/**
 * Get person details by ID
 * @param {number|string} personId - Person ID
 * @returns {Promise<Object>} Person details response
 */
export const getPersonDetails = (personId) => {
  return tmdbAxios.get(`/person/${personId}?append_to_response=movie_credits,tv_credits,images`);
};

/* =========================================================================
   WATCH PROVIDERS ENDPOINTS
   ========================================================================= */

/**
 * Get watch providers for a movie or TV show
 * @param {string} mediaType - 'movie' or 'tv'
 * @param {number|string} id - Media ID
 * @returns {Promise<Object>} Watch providers response
 */
export const getWatchProviders = (mediaType, id) => {
  return tmdbAxios.get(`/${mediaType}/${id}/watch/providers`);
};

/* =========================================================================
   UTILITY FUNCTIONS
   ========================================================================= */

/**
 * Construct TMDB image URL
 * @param {string} path - Image path from TMDB API
 * @param {string} size - Image size (e.g., 'w200', 'w300', 'w500', 'w780', 'original')
 * @returns {string} Complete image URL or placeholder
 */
export const getImageURL = (path, size = 'w500') => {
  if (!path) {
    // Return a placeholder image if path is null or undefined
    return 'https://via.placeholder.com/500x750/141414/666666?text=No+Image';
  }
  const baseUrl = import.meta.env.VITE_TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  return `${baseUrl}/${size}${path}`;
};

/**
 * Extract YouTube trailer key from TMDB videos array
 * @param {Array} videos - Videos array from TMDB response
 * @returns {string|null} YouTube video key or null
 */
export const getYouTubeTrailerKey = (videos) => {
  if (!videos || !Array.isArray(videos) || videos.length === 0) {
    return null;
  }
  
  // Look for official trailers first
  const trailer = videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Trailer'
  );
  
  if (trailer) return trailer.key;
  
  // Fallback to teaser
  const teaser = videos.find(
    (video) => video.site === 'YouTube' && video.type === 'Teaser'
  );
  
  return teaser ? teaser.key : null;
};

/**
 * Get genre name from ID
 * @param {number} genreId - Genre ID
 * @param {Array} genreList - Array of genre objects {id, name}
 * @returns {string} Genre name or 'Unknown'
 */
export const getGenreName = (genreId, genreList = []) => {
  if (!Array.isArray(genreList)) return 'Unknown';
  const genre = genreList.find((g) => g.id === genreId);
  return genre ? genre.name : 'Unknown';
};

/**
 * Format runtime from minutes to hours and minutes
 * @param {number} minutes - Total runtime in minutes
 * @returns {string} Formatted runtime (e.g., '2h 18m')
 */
export const formatRuntime = (minutes) => {
  if (!minutes) return 'N/A';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Format TMDB rating to one decimal place
 * @param {number} voteAverage - Rating from TMDB (e.g., 8.432)
 * @returns {string} Formatted rating (e.g., '8.4')
 */
export const formatRating = (voteAverage) => {
  if (!voteAverage) return 'NR'; // Not Rated
  return (Math.round(voteAverage * 10) / 10).toFixed(1);
};

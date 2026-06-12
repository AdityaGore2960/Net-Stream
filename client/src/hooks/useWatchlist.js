import { useState, useCallback, useEffect } from 'react';
import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import toast from 'react-hot-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Custom hook for Watchlist operations
 */
export const useWatchlist = () => {
  const [watchlist, setWatchlist] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { token, isAuthenticated } = useAuthStore();

  /**
   * Fetch user's watchlist
   * config is built inside useCallback so it doesn't cause a new function
   * reference on every render (which would re-trigger the useEffect).
   */
  const fetchWatchlist = useCallback(async () => {
    if (!isAuthenticated || !token) return;
    setIsLoading(true);
    try {
      const { data } = await axios.get(`${API_URL}/watchlist`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (data.success) {
        setWatchlist(data.data);
      }
    } catch (error) {
      console.error('Error fetching watchlist:', error);
      toast.error('Failed to load watchlist');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, token]); // ← only re-creates when auth state genuinely changes

  useEffect(() => {
    fetchWatchlist();
  }, [fetchWatchlist]);

  /**
   * Add item to watchlist
   * @param {Object} item - Media item (movie or tv show)
   * @param {'movie'|'tv'} mediaType - Type of media
   */
  const addToWatchlist = async (item, mediaType = 'movie') => {
    if (!isAuthenticated) {
      toast.error('Please login to add to watchlist');
      return false;
    }

    const watchlistItem = {
      tmdbId: item.id,
      mediaType,
      title: item.title || item.name,
      posterPath: item.poster_path,
      backdropPath: item.backdrop_path,
      voteAverage: item.vote_average,
      releaseDate: item.release_date || item.first_air_date,
      overview: item.overview,
    };

    // Optimistic UI update
    setWatchlist(prev => [watchlistItem, ...prev]);

    try {
      await axios.post(`${API_URL}/watchlist`, watchlistItem, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success(`${watchlistItem.title} added to My List`);
      return true;
    } catch (error) {
      // Revert optimistic update on failure
      setWatchlist(prev => prev.filter(w => w.tmdbId !== item.id));

      const msg = error.response?.data?.message || 'Failed to add item';
      if (error.response?.status !== 409) { // Don't toast if it's already there
        toast.error(msg);
      }
      return false;
    }
  };

  /**
   * Remove item from watchlist
   * @param {number} tmdbId - TMDB ID of the item
   * @param {'movie'|'tv'} mediaType - Media type
   */
  const removeFromWatchlist = async (tmdbId, mediaType = 'movie') => {
    if (!isAuthenticated) return false;

    // Save previous state for rollback
    const previousWatchlist = [...watchlist];

    // Optimistic UI update
    setWatchlist(prev => prev.filter(item => item.tmdbId !== tmdbId));

    try {
      await axios.delete(`${API_URL}/watchlist/${tmdbId}?mediaType=${mediaType}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Removed from My List');
      return true;
    } catch (error) {
      // Rollback
      setWatchlist(previousWatchlist);
      toast.error('Failed to remove item');
      return false;
    }
  };

  /**
   * Check if an item is in the watchlist
   * @param {number} tmdbId - TMDB ID
   * @returns {boolean}
   */
  const isInWatchlist = useCallback((tmdbId) => {
    return watchlist.some(item => item.tmdbId === tmdbId);
  }, [watchlist]);

  return {
    watchlist,
    isLoading,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
    refreshWatchlist: fetchWatchlist
  };
};

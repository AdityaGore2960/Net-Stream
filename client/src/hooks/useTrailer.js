import { useState, useEffect } from 'react';
import { getMovieDetails, getTVDetails, getYouTubeTrailerKey } from '../services/tmdb';
import toast from 'react-hot-toast';

/**
 * Custom hook to fetch a YouTube trailer for a movie or TV show
 * @param {'movie'|'tv'} mediaType - Type of media
 * @param {number} mediaId - ID of the media
 */
export const useTrailer = (mediaType, mediaId) => {
  const [trailerKey, setTrailerKey] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!mediaId || !mediaType) return;

    const fetchTrailer = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        let response;
        if (mediaType === 'movie') {
          response = await getMovieDetails(mediaId);
        } else if (mediaType === 'tv') {
          response = await getTVDetails(mediaId);
        }

        if (response && response.videos && response.videos.results) {
          const key = getYouTubeTrailerKey(response.videos.results);
          if (key) {
            setTrailerKey(key);
          } else {
            setError('No trailer available');
          }
        } else {
          setError('No trailer available');
        }
      } catch (err) {
        console.error('Error fetching trailer:', err);
        setError('Failed to fetch trailer');
        toast.error('Could not load trailer');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrailer();
  }, [mediaType, mediaId]);

  return {
    trailerKey,
    isLoading,
    error,
    hasTrailer: !!trailerKey
  };
};

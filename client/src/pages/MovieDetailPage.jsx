import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import MovieDetail from '../components/Detail/MovieDetail';
import ContentRow from '../components/Home/ContentRow';
import { useGetDetails } from '../hooks/useMovies';
import { useTrailer } from '../hooks/useTrailer';
import { useUIStore } from '../store/uiStore';
import ReactPlayer from 'react-player/youtube';
import { FaTimes } from 'react-icons/fa';

const MovieDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const { data, isLoading, error } = useGetDetails(mediaType, id);
  const { trailerKey } = useTrailer(mediaType, id);
  const { isTrailerOpen, closeTrailer, isPlayerOpen, closePlayer } = useUIStore();

  // Scroll to top on mount or ID change
  useEffect(() => {
    window.scrollTo(0, 0);
    closeTrailer();
    if (closePlayer) closePlayer();
  }, [id, closeTrailer, closePlayer]);

  const getEmbedUrl = () => {
    const baseUrl = 'https://vidfast.pro';
    const commonParams = 'autoPlay=true&theme=e50914&title=true&poster=true&hideServer=true';

    if (mediaType === 'tv') {
      // Default to Season 1, Episode 1 for TV Shows
      return `${baseUrl}/tv/${id}/1/1?${commonParams}&nextButton=true&autoNext=true`;
    }

    return `${baseUrl}/movie/${id}?${commonParams}`;
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-screen bg-ns-black animate-pulse flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-ns-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-ns-gray-1 text-lg">The movie or TV show you are looking for does not exist.</p>
        </div>
      </Layout>
    );
  }

  // Helper hook functions for similar/recommendations to pass to ContentRow
  const fetchSimilar = () => ({ data: data.similar, isLoading: false, error: null });
  const fetchRecommendations = () => ({ data: data.recommendations, isLoading: false, error: null });

  return (
    <Layout>
      <MovieDetail item={data} mediaType={mediaType} />

      <div className="pb-12 space-y-8 mt-4 relative z-10">
        {data.similar?.results?.length > 0 && (
          <ContentRow
            title="More Like This"
            fetchHook={fetchSimilar}
            type={mediaType}
          />
        )}

        {data.recommendations?.results?.length > 0 && (
          <ContentRow
            title="Recommendations"
            fetchHook={fetchRecommendations}
            type={mediaType}
          />
        )}
      </div>

      {/* Trailer Modal */}
      {isTrailerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={closeTrailer}
            className="absolute top-6 right-6 text-white hover:text-ns-red transition-colors z-50"
          >
            <FaTimes size={32} />
          </button>

          <div className="w-full max-w-5xl aspect-video px-4">
            {trailerKey ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailerKey}`}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-ns-dark-3 rounded">
                <p className="text-xl text-ns-gray-1">Trailer not available</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Player Modal */}
      {isPlayerOpen && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center">
          <button
            onClick={closePlayer}
            className="absolute top-6 right-6 text-white hover:text-ns-red transition-colors z-50"
          >
            <FaTimes size={32} />
          </button>

          <div className="w-full max-w-5xl aspect-video px-4 bg-ns-black rounded shadow-2xl overflow-hidden">
            <iframe
              src={getEmbedUrl()}
              className="w-full h-full border-0"
              allowFullScreen
              allow="encrypted-media"
              frameBorder="0"
              title="Video Player"
            ></iframe>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default MovieDetailPage;

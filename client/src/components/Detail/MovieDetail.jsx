import React from 'react';
import { FaPlay, FaPlus, FaCheck, FaShareAlt } from 'react-icons/fa';
import { getImageURL, formatRating, formatRuntime } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useUIStore } from '../../store/uiStore';
import { useWatchProviders } from '../../hooks/useMovies';
import WatchOptionsSection from './WatchOptionsSection';
import UnavailableState from './UnavailableState';

/**
 * Movie Detail presentation component
 */
const MovieDetail = ({ item, mediaType }) => {
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { openTrailer, openPlayer } = useUIStore();

  const TARGET_REGION = 'IN';
  const { data: providerData, isLoading: providersLoading } = useWatchProviders(mediaType, item?.id);
  const regionProviders = providerData?.results?.[TARGET_REGION];

  if (!item) return null;

  const inList = isInWatchlist(item.id);
  const title = item.title || item.name;
  const releaseDate = item.release_date || item.first_air_date;
  const year = releaseDate ? new Date(releaseDate).getFullYear() : '';
  const runtime = formatRuntime(item.runtime || (item.episode_run_time ? item.episode_run_time[0] : 0));

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(item.id, mediaType);
    } else {
      addToWatchlist(item, mediaType);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out ${title} on NetStream`,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  const hasProviders = regionProviders && (
    (regionProviders.flatrate?.length > 0) ||
    (regionProviders.rent?.length > 0) ||
    (regionProviders.buy?.length > 0)
  );

  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <div className="relative w-full h-auto min-h-[70vh] bg-ns-black flex flex-col justify-end">
        <div className="absolute inset-0 z-0">
          <img
            src={getImageURL(item.backdrop_path, 'w1280')}
            alt={title}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ns-black via-ns-black/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-ns-black via-ns-black/50 to-transparent" />
        </div>

        <div className="relative z-10 w-full p-4 pt-32 md:p-12 lg:p-16 flex flex-col md:flex-row gap-8 lg:gap-12">
          {/* Poster - hidden on small mobile, visible on md+ */}
          <div className="hidden md:block w-48 lg:w-64 flex-shrink-0">
            <img
              src={getImageURL(item.poster_path, 'w500')}
              alt={title}
              className="w-full rounded-lg shadow-2xl border border-white/10"
            />
          </div>

          <div className="flex-grow max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-md">{title}</h1>

            {item.tagline && (
              <p className="text-xl md:text-2xl italic text-gray-300 mb-6 drop-shadow-md">
                "{item.tagline}"
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6">
              <span className="text-green-400 font-bold">{formatRating(item.vote_average)} Match</span>
              <span>{year}</span>
              <span>{runtime}</span>
              <span className="border border-gray-500 px-1 rounded">HD</span>
              <div className="flex gap-2 flex-wrap">
                {item.genres?.map(g => (
                  <span key={g.id} className="text-white bg-white/10 px-2 py-0.5 rounded-full text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-lg md:text-xl leading-relaxed text-gray-200 drop-shadow-md mb-8">
              {item.overview}
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <button 
                onClick={openPlayer}
                className="flex items-center gap-2 bg-ns-red text-white px-6 py-3 rounded hover:bg-ns-red-hover transition-colors font-bold text-lg shadow-lg shadow-ns-red/20"
              >
                <FaPlay /> Play Now
              </button>

              {!hasProviders && (
                <button 
                  onClick={() => openTrailer(null)}
                  className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded hover:bg-white/80 transition-colors font-bold text-lg"
                >
                  Watch Trailer
                </button>
              )}

              <button
                onClick={handleWatchlistToggle}
                className="flex items-center gap-2 bg-ns-dark-3/80 text-white px-6 py-3 rounded hover:bg-ns-dark-2 transition-colors font-bold text-lg border border-ns-gray-2"
                title={inList ? "Remove from My List" : "Add to My List"}
              >
                {inList ? <><FaCheck /> In My List</> : <><FaPlus /> My List</>}
              </button>

              <button
                onClick={handleShare}
                className="w-12 h-12 flex items-center justify-center rounded bg-ns-dark-3/80 border border-ns-gray-2 hover:border-white transition-colors"
                title="Share"
              >
                <FaShareAlt className="text-white text-lg" />
              </button>
            </div>

            {/* Providers Section */}
            {providersLoading ? (
              <div className="h-32 bg-ns-dark-3/50 rounded-xl animate-pulse max-w-3xl border border-ns-gray-3"></div>
            ) : hasProviders ? (
              <WatchOptionsSection watchData={regionProviders} />
            ) : (
              <UnavailableState regionName="India" />
            )}
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="px-4 md:px-12 lg:px-16 py-12 bg-ns-black grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-ns-gray-3/30">
        <div>
          <h3 className="text-ns-gray-1 text-sm mb-1">Status</h3>
          <p className="mb-4">{item.status}</p>

          <h3 className="text-ns-gray-1 text-sm mb-1">Release Date</h3>
          <p className="mb-4">{releaseDate}</p>

          <h3 className="text-ns-gray-1 text-sm mb-1">Original Language</h3>
          <p className="mb-4 uppercase">{item.original_language}</p>
        </div>

        <div>
          <h3 className="text-ns-gray-1 text-sm mb-1">Production Companies</h3>
          <p className="mb-4">
            {item.production_companies?.map(c => c.name).join(', ') || 'N/A'}
          </p>

          {mediaType === 'movie' && (
            <>
              <h3 className="text-ns-gray-1 text-sm mb-1">Budget</h3>
              <p className="mb-4">
                {item.budget ? `$${(item.budget / 1000000).toFixed(1)}M` : 'N/A'}
              </p>

              <h3 className="text-ns-gray-1 text-sm mb-1">Revenue</h3>
              <p className="mb-4">
                {item.revenue ? `$${(item.revenue / 1000000).toFixed(1)}M` : 'N/A'}
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

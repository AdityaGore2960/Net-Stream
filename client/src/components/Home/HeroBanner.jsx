import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaInfoCircle, FaStar } from 'react-icons/fa';
import { getImageURL, formatRating, formatRuntime } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useUIStore } from '../../store/uiStore';

/**
 * Featured movie banner on homepage
 */
const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading] = useState(false);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { openTrailer } = useUIStore();

  useEffect(() => {
    if (!movies || movies.length === 0) return;

    const interval = setInterval(() => {
      setIsFading(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % Math.min(movies.length, 10)); // Cycle through top 10
        setIsFading(false);
      }, 500); // 500ms fade transition
    }, 8000); // Rotate every 8 seconds

    return () => clearInterval(interval);
  }, [movies]);

  if (!movies || movies.length === 0) {
    return <div className="w-full h-[70vh] md:h-[85vh] bg-ns-dark animate-pulse"></div>;
  }

  const movie = movies[currentIndex];
  const inList = isInWatchlist(movie.id);

  const handleWatchlistToggle = () => {
    if (inList) {
      removeFromWatchlist(movie.id, 'movie');
    } else {
      addToWatchlist(movie, 'movie');
    }
  };

  // Truncate overview
  const truncate = (str, n) => {
    return str?.length > n ? str.substr(0, n - 1) + '...' : str;
  };

  return (
    <div className="relative w-full h-[70vh] md:h-[85vh] text-white overflow-hidden">
      {/* Background Image */}
      <div
        className={`absolute inset-0 transition-opacity duration-500 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
      >
        <img
          src={getImageURL(movie.backdrop_path, 'original')}
          alt={movie.title}
          className="w-full h-full object-cover object-top"
        />
        {/* Gradients */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent opacity-100 h-full top-auto bottom-0 w-full" style={{ height: '30%' }} />
      </div>

      {/* Content */}
      <div className="absolute top-[30%] md:top-[35%] left-0 px-4 md:px-12 lg:px-16 w-full md:w-[60%] lg:w-[50%] z-10 transition-opacity duration-500">
        <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold mb-4 drop-shadow-lg transition-all duration-500 ${isFading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          {movie.title || movie.name}
        </h1>

        <div className={`flex items-center gap-4 mb-4 text-sm md:text-base transition-all duration-500 delay-100 ${isFading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <div className="flex items-center gap-1 text-green-400 font-bold">
            <FaStar className="text-yellow-400" />
            <span>{formatRating(movie.vote_average)} Rating</span>
          </div>
          <span className="text-ns-gray-1">|</span>
          <span className="font-semibold">{new Date(movie.release_date).getFullYear()}</span>
          <span className="text-ns-gray-1">|</span>
          <span className="border border-ns-gray-2 px-1 text-xs text-ns-gray-1 rounded">PG-13</span>
        </div>

        <p className={`text-base md:text-lg text-gray-200 mb-8 max-w-2xl drop-shadow-md leading-snug transition-all duration-500 delay-200 ${isFading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          {truncate(movie.overview, 180)}
        </p>

        <div className={`flex items-center gap-3 md:gap-4 transition-all duration-500 delay-300 ${isFading ? 'translate-y-4 opacity-0' : 'translate-y-0 opacity-100'}`}>
          <button
            onClick={() => openTrailer(null)} // Will handle in detail page or with a separate hook here
            className="flex items-center gap-2 bg-white text-black px-6 md:px-8 py-2 md:py-3 rounded font-semibold hover:bg-white/80 transition-colors"
          >
            <FaPlay />
            Play
          </button>

          <button
            onClick={handleWatchlistToggle}
            className="flex items-center gap-2 bg-ns-gray-3/80 text-white px-4 py-2 md:py-3 rounded font-semibold hover:bg-ns-gray-2/80 transition-colors border border-ns-gray-2/50"
          >
            {inList ? <FaPlus className="rotate-45" /> : <FaPlus />}
            {inList ? 'My List' : 'My List'}
          </button>

          <Link
            to={`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`}
            className="flex items-center gap-2 bg-ns-gray-3/80 text-white px-4 py-2 md:py-3 rounded font-semibold hover:bg-ns-gray-2/80 transition-colors border border-ns-gray-2/50"
          >
            <FaInfoCircle />
            <span className="hidden sm:inline">More Info</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;

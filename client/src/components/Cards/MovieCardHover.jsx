import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { getImageURL, formatRating, getGenreName } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useMovieStore } from '../../store/movieStore';
import { useUIStore } from '../../store/uiStore';

/**
 * The expanded hover state of a MovieCard
 */
const MovieCardHover = ({ item, mediaType, parentRef, isLarge, onMouseLeave }) => {
  const [position, setPosition] = useState({ top: 0, left: 0, width: 0 });
  const [isRendered, setIsRendered] = useState(false);
  const navigate = useNavigate();
  
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { genres } = useMovieStore();
  const { openTrailer } = useUIStore();
  
  const inList = isInWatchlist(item.id);
  
  // Calculate position based on parent element
  useEffect(() => {
    if (parentRef.current) {
      const rect = parentRef.current.getBoundingClientRect();
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Calculate expansion width (approx 1.5x)
      const hoverWidth = rect.width * 1.5;
      
      // Calculate left position (prevent overflowing viewport edges)
      let left = rect.left - (hoverWidth - rect.width) / 2;
      
      // Adjust if too close to left edge
      if (left < 20) left = 20;
      
      // Adjust if too close to right edge
      const windowWidth = window.innerWidth;
      if (left + hoverWidth > windowWidth - 20) {
        left = windowWidth - hoverWidth - 20;
      }
      
      setPosition({
        top: rect.top + scrollY - (isLarge ? 20 : 60), // pop up slightly
        left: left,
        width: hoverWidth,
      });
      
      // Trigger animation after brief delay
      setTimeout(() => setIsRendered(true), 50);
    }
  }, [parentRef, isLarge]);

  const handleWatchlistToggle = (e) => {
    e.stopPropagation();
    if (inList) {
      removeFromWatchlist(item.id, mediaType);
    } else {
      addToWatchlist(item, mediaType);
    }
  };

  const handleNavigate = (e) => {
    e.stopPropagation();
    navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    openTrailer(null); // Just opens the modal for now, detail page will load the key
    navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`);
  };

  // Get first 3 genres
  const itemGenres = item.genre_ids?.slice(0, 3).map(id => {
    const genreList = mediaType === 'tv' ? genres.tv : genres.movies;
    return getGenreName(id, genreList);
  }).filter(name => name !== 'Unknown') || [];

  return (
    <div
      className={`fixed z-50 bg-[#181818] rounded-md shadow-2xl transition-all duration-300 ease-in-out cursor-pointer overflow-hidden origin-bottom
        ${isRendered ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
      `}
      style={{
        top: position.top,
        left: position.left,
        width: position.width,
        pointerEvents: isRendered ? 'auto' : 'none'
      }}
      onMouseLeave={onMouseLeave}
      onClick={handleNavigate}
    >
      {/* Video/Image Header */}
      <div className="relative aspect-video w-full bg-ns-dark">
        <img
          src={getImageURL(item.backdrop_path || item.poster_path, 'w500')}
          alt={item.title || item.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#181818] via-transparent to-transparent" />
        <h3 className="absolute bottom-2 left-4 right-4 font-bold text-white text-lg truncate drop-shadow-md">
          {item.title || item.name}
        </h3>
      </div>

      {/* Details Container */}
      <div className="p-4 text-white">
        {/* Actions Row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={handlePlay}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-white text-black flex items-center justify-center hover:bg-white/80 transition-colors"
              aria-label="Play"
            >
              <FaPlay className="ml-1 text-sm md:text-base" />
            </button>
            <button 
              onClick={handleWatchlistToggle}
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ns-dark-3 border-2 border-ns-gray-2 flex items-center justify-center hover:border-white transition-colors group"
              aria-label="Add to My List"
            >
              {inList ? (
                <FaCheck className="text-white group-hover:text-white" />
              ) : (
                <FaPlus className="text-white group-hover:text-white" />
              )}
            </button>
            <button 
              className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ns-dark-3 border-2 border-ns-gray-2 flex items-center justify-center hover:border-white transition-colors"
              aria-label="Like"
            >
              <FaThumbsUp className="text-white" />
            </button>
          </div>
          <button 
            onClick={handleNavigate}
            className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-ns-dark-3 border-2 border-ns-gray-2 flex items-center justify-center hover:border-white transition-colors"
            aria-label="More Info"
          >
            <FaChevronDown className="text-white" />
          </button>
        </div>

        {/* Meta Info */}
        <div className="flex items-center gap-2 mb-2 text-xs md:text-sm">
          <span className="text-green-400 font-bold">{formatRating(item.vote_average)} Rating</span>
          <span className="text-white border border-ns-gray-2 px-1 rounded text-[10px] md:text-xs">HD</span>
          <span>{(item.release_date || item.first_air_date)?.substring(0, 4)}</span>
        </div>

        {/* Genres */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-ns-gray-1">
          {itemGenres.map((genre, index) => (
            <React.Fragment key={genre}>
              <span className="text-white">{genre}</span>
              {index < itemGenres.length - 1 && <span className="w-1 h-1 rounded-full bg-ns-gray-2 mx-1" />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieCardHover;

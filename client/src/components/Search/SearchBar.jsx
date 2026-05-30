import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useSearch } from '../../hooks/useSearch';
import { useUIStore } from '../../store/uiStore';
import { getImageURL } from '../../services/tmdb';

/**
 * Animated Search Bar with dropdown results
 */
const SearchBar = () => {
  const [query, setQuery] = useState('');
  const { isSearchOpen, setSearchOpen } = useUIStore();
  const inputRef = useRef(null);
  const navigate = useNavigate();
  
  const { results, isLoading, hasResults } = useSearch(query, 500);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    } else {
      setQuery(''); // Clear on close
    }
  }, [isSearchOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setSearchOpen(false);
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleResultClick = (item) => {
    setSearchOpen(false);
    const mediaType = item.media_type === 'tv' ? 'tv' : 'movie';
    if (item.media_type === 'person') {
      // Could navigate to person detail if implemented
      navigate(`/search?q=${encodeURIComponent(item.name)}`);
    } else {
      navigate(`/${mediaType}/${item.id}`);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isSearchOpen && (
        <div 
          className="fixed inset-0 bg-black/60 z-40 backdrop-blur-sm"
          onClick={() => setSearchOpen(false)}
        />
      )}

      {/* Search Container */}
      <div 
        className={`fixed top-0 left-0 w-full bg-[#141414] z-50 transform transition-transform duration-300 ease-in-out ${
          isSearchOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="container mx-auto px-4 md:px-8 py-4">
          <form onSubmit={handleSubmit} className="relative flex items-center">
            <FaSearch className="text-ns-gray-1 absolute left-4 text-xl" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Titles, people, genres"
              className="w-full bg-ns-dark-3 text-white text-lg md:text-xl lg:text-2xl py-4 pl-12 pr-12 rounded focus:outline-none focus:ring-1 focus:ring-white border border-transparent transition-all"
            />
            <button 
              type="button"
              onClick={() => setSearchOpen(false)}
              className="absolute right-4 text-white hover:text-ns-red transition-colors"
            >
              <FaTimes className="text-2xl" />
            </button>
          </form>

          {/* Results Dropdown */}
          {query.trim().length > 1 && (
            <div className="mt-4 max-h-[60vh] overflow-y-auto scrollbar-hide border-t border-ns-gray-3 pt-4">
              {isLoading ? (
                <div className="text-center py-8 text-ns-gray-1 animate-pulse">Searching...</div>
              ) : hasResults ? (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {results.slice(0, 10).map(item => {
                    const title = item.title || item.name;
                    const imagePath = item.poster_path || item.profile_path;
                    
                    return (
                      <div 
                        key={`${item.media_type}-${item.id}`}
                        onClick={() => handleResultClick(item)}
                        className="cursor-pointer group flex flex-col gap-2"
                      >
                        <div className="aspect-[2/3] w-full rounded overflow-hidden bg-ns-dark-3">
                          {imagePath ? (
                            <img 
                              src={getImageURL(imagePath, 'w300')}
                              alt={title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-center p-2 text-ns-gray-1">
                              {title}
                            </div>
                          )}
                        </div>
                        <p className="text-sm text-gray-300 group-hover:text-white truncate">{title}</p>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 text-ns-gray-1 text-lg">
                  No results found for "{query}"
                </div>
              )}
              
              {hasResults && (
                <div className="mt-8 text-center pb-4">
                  <button 
                    onClick={handleSubmit}
                    className="text-ns-gray-1 hover:text-white underline underline-offset-4"
                  >
                    See all results for "{query}"
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SearchBar;

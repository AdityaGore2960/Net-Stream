import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import MovieCard from '../components/Cards/MovieCard';
import { useGetByGenre } from '../hooks/useMovies';
import { TV_GENRES } from '../utils/constants';

const TVShows = () => {
  const [activeGenre, setActiveGenre] = useState(TV_GENRES.DRAMA);
  const [page, setPage] = useState(1);
  const [shows, setShows] = useState([]);
  
  const { data, isLoading, error } = useGetByGenre('tv', activeGenre, page);

  // When genre changes, reset page and shows
  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setPage(1);
    setShows([]);
  };

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setShows(data.results);
      } else {
        setShows(prev => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (data?.page < data?.total_pages) {
      setPage(prev => prev + 1);
    }
  };

  const genreList = Object.entries(TV_GENRES).map(([key, value]) => ({
    name: key.replace('_', ' '),
    id: value
  }));

  return (
    <Layout>
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">TV Shows</h1>
            
            {/* Genre Filter */}
            <select 
              className="bg-ns-dark-3 border border-ns-gray-2 text-white text-sm rounded px-4 py-2 outline-none focus:border-white"
              value={activeGenre}
              onChange={(e) => handleGenreChange(Number(e.target.value))}
            >
              {genreList.map(genre => (
                <option key={genre.id} value={genre.id}>
                  {genre.name}
                </option>
              ))}
            </select>
          </div>

          {error && <p className="text-red-500">Failed to load TV shows.</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {shows.map((show, index) => (
              <MovieCard 
                key={`${show.id}-${index}`} 
                item={show} 
                mediaType="tv" 
                isLarge={true} 
              />
            ))}
            
            {isLoading && Array.from({ length: 12 }).map((_, i) => (
              <div key={`skel-${i}`} className="bg-ns-dark-3 animate-pulse rounded-md aspect-[2/3] w-full"></div>
            ))}
          </div>
          
          {!isLoading && data?.page < data?.total_pages && (
            <div className="mt-12 text-center">
              <button 
                onClick={loadMore}
                className="bg-transparent border border-ns-gray-1 text-white px-8 py-3 rounded hover:bg-white hover:text-black transition-colors font-medium"
              >
                Load More
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default TVShows;

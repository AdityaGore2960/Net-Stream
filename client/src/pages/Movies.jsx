import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout/Layout';
import MovieCard from '../components/Cards/MovieCard';
import { useGetByGenre } from '../hooks/useMovies';
import { MOVIE_GENRES } from '../utils/constants';

const Movies = () => {
  const [activeGenre, setActiveGenre] = useState(MOVIE_GENRES.ACTION);
  const [page, setPage] = useState(1);
  const [movies, setMovies] = useState([]);
  
  const { data, isLoading, error } = useGetByGenre('movie', activeGenre, page);

  // When genre changes, reset page and movies
  const handleGenreChange = (genreId) => {
    setActiveGenre(genreId);
    setPage(1);
    setMovies([]);
  };

  useEffect(() => {
    if (data?.results) {
      if (page === 1) {
        setMovies(data.results);
      } else {
        setMovies(prev => [...prev, ...data.results]);
      }
    }
  }, [data, page]);

  const loadMore = () => {
    if (data?.page < data?.total_pages) {
      setPage(prev => prev + 1);
    }
  };

  const genreList = Object.entries(MOVIE_GENRES).map(([key, value]) => ({
    name: key.replace('_', ' '),
    id: value
  }));

  return (
    <Layout>
      <div className="pt-24 pb-12 min-h-screen">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <h1 className="text-3xl md:text-4xl font-bold">Movies</h1>
            
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

          {error && <p className="text-red-500">Failed to load movies.</p>}

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {movies.map((movie, index) => (
              <MovieCard 
                key={`${movie.id}-${index}`} 
                item={movie} 
                mediaType="movie" 
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

export default Movies;

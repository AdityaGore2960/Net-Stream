import React from 'react';
import Layout from '../components/Layout/Layout';
import MovieCard from '../components/Cards/MovieCard';
import { useWatchlist } from '../hooks/useWatchlist';
import { useAuthStore } from '../store/authStore';
import { Link } from 'react-router-dom';

const MyList = () => {
  const { watchlist, isLoading } = useWatchlist();
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 pt-24">
          <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center">My List</h1>
          <p className="text-ns-gray-1 text-lg mb-8 text-center">Please sign in to view and manage your watchlist.</p>
          <Link to="/login" className="bg-ns-red text-white px-8 py-3 rounded text-lg font-medium hover:bg-ns-red-hover transition-colors">
            Sign In
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 md:px-8 pt-24 pb-12 min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">My List</h1>
        
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="bg-ns-dark-3 animate-pulse rounded-md aspect-[2/3] w-full"></div>
            ))}
          </div>
        ) : watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlist.map(item => (
              <div key={item.tmdbId} className="w-full">
                {/* Remap the property names for MovieCard */}
                <MovieCard 
                  item={{
                    ...item,
                    id: item.tmdbId,
                    title: item.title,
                    name: item.title,
                    poster_path: item.posterPath,
                    backdrop_path: item.backdropPath,
                    vote_average: item.voteAverage
                  }} 
                  mediaType={item.mediaType} 
                  isLarge={true}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-xl text-ns-gray-1 mb-6">Your list is empty.</p>
            <Link to="/" className="bg-white text-black px-6 py-2 rounded font-medium hover:bg-gray-200 transition-colors">
              Explore Content
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyList;

import React, { Suspense, lazy, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';
import { useMovieStore } from './store/movieStore';
import { getMovieGenres, getTVGenres } from './services/tmdb';

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'));
const Movies = lazy(() => import('./pages/Movies'));
const TVShows = lazy(() => import('./pages/TVShows'));
const MyList = lazy(() => import('./pages/MyList'));
const MovieDetailPage = lazy(() => import('./pages/MovieDetailPage'));

// Auth Pages
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

const App = () => {
  // Use the store's getState() so we get stable function references
  // that never change between renders — avoids the infinite-loop
  // that happens when Zustand actions are used as useEffect deps.
  const didInit = useRef(false);

  useEffect(() => {
    // Guard: run only once on mount, never again
    if (didInit.current) return;
    didInit.current = true;

    // Stable references via getState() — not affected by re-renders
    const checkAuth = useAuthStore.getState().checkAuth;
    const setGenres = useMovieStore.getState().setGenres;

    // Check authentication status once on app load
    checkAuth();

    // Load genres globally once on app load
    const loadGenres = async () => {
      try {
        const [moviesRes, tvRes] = await Promise.all([
          getMovieGenres(),
          getTVGenres(),
        ]);
        setGenres('movies', moviesRes.genres);
        setGenres('tv', tvRes.genres);
      } catch (error) {
        console.error('Failed to load genres:', error);
      }
    };

    loadGenres();
  }, []); // ← empty array: intentionally runs once on mount only

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
          },
        }}
      />
      <Suspense fallback={
        <div className="w-full h-screen bg-ns-black flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-ns-red border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/tv" element={<TVShows />} />
          <Route path="/my-list" element={<MyList />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/tv/:id" element={<MovieDetailPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={
            <div className="h-screen flex items-center justify-center text-white bg-ns-black">
              <h1 className="text-4xl font-bold">404 - Page Not Found</h1>
            </div>
          } />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

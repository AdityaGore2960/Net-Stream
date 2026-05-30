import { create } from 'zustand';

/**
 * Zustand store for Movie & TV Show Data
 */
export const useMovieStore = create((set) => ({
  trendingMovies: [],
  topRatedMovies: [],
  popularMovies: [],
  nowPlayingMovies: [],
  popularTV: [],
  topRatedTV: [],
  genres: { movies: [], tv: [] },
  currentMovie: null,
  
  /**
   * Actions to set data
   */
  setTrending: (movies) => set({ trendingMovies: movies }),
  setTopRated: (movies) => set({ topRatedMovies: movies }),
  setPopular: (movies) => set({ popularMovies: movies }),
  setNowPlaying: (movies) => set({ nowPlayingMovies: movies }),
  
  setPopularTV: (shows) => set({ popularTV: shows }),
  setTopRatedTV: (shows) => set({ topRatedTV: shows }),
  
  setGenres: (type, genresList) => set((state) => ({
    genres: {
      ...state.genres,
      [type]: genresList
    }
  })),
  
  setCurrentMovie: (movie) => set({ currentMovie: movie }),
  clearCurrentMovie: () => set({ currentMovie: null }),
}));

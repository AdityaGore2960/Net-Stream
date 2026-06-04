import React from 'react';
import Layout from '../components/Layout/Layout';
import HeroBanner from '../components/Home/HeroBanner';
import ContentRow from '../components/Home/ContentRow';
import {
  useGetTrendingAll,
  useGetTopRated,
  useGetPopular,
  useGetNowPlaying,
  useGetByGenre,
} from '../hooks/useMovies';

/* TMDB genre IDs */
const GENRE_ACTION    = 28;
const GENRE_COMEDY    = 35;
const GENRE_SCI_FI    = 878;
const GENRE_THRILLER  = 53;
const GENRE_ANIMATION = 16;

const Home = () => {
  const { data: heroData } = useGetTrendingAll('day');

  return (
    <Layout>
      {/* ── Hero ───────────────────────────────────────────── */}
      <HeroBanner movies={heroData?.results || []} />

      {/* ── Content rows ───────────────────────────────────── */}
      <div
        style={{
          marginTop:   '-100px',
          position:    'relative',
          zIndex:      20,
          paddingBottom: 60,
          background:  'linear-gradient(to bottom, transparent 0%, #0a0a0a 120px)',
        }}
      >
        {/* 1. Trending Now (large posters) */}
        <ContentRow
          title="Trending Now"
          fetchHook={() => useGetTrendingAll('day')}
          type="movie"
          isLarge={true}
          accent="#e50914"
        />

        {/* 2. New Arrivals */}
        <ContentRow
          title="New Arrivals"
          fetchHook={() => useGetNowPlaying(1)}
          type="movie"
          accent="#f59e0b"
        />

        {/* 3. Popular TV Shows */}
        <ContentRow
          title="Popular on TV"
          fetchHook={() => useGetPopular('tv', 1)}
          type="tv"
          accent="#22d3ee"
        />

        {/* 4. Top Rated Movies */}
        <ContentRow
          title="Top Rated"
          fetchHook={() => useGetTopRated('movie', 1)}
          type="movie"
          accent="#4ade80"
        />

        {/* 5. Action & Adventure */}
        <ContentRow
          title="Action & Adventure"
          fetchHook={() => useGetByGenre('movie', GENRE_ACTION, 1)}
          type="movie"
          accent="#f97316"
        />

        {/* 6. Sci-Fi & Fantasy */}
        <ContentRow
          title="Sci-Fi & Fantasy"
          fetchHook={() => useGetByGenre('movie', GENRE_SCI_FI, 1)}
          type="movie"
          accent="#a78bfa"
        />

        {/* 7. Comedy */}
        <ContentRow
          title="Feel-Good Comedy"
          fetchHook={() => useGetByGenre('movie', GENRE_COMEDY, 1)}
          type="movie"
          accent="#facc15"
        />

        {/* 8. Thrills & Suspense */}
        <ContentRow
          title="Thrills & Suspense"
          fetchHook={() => useGetByGenre('movie', GENRE_THRILLER, 1)}
          type="movie"
          accent="#f472b6"
        />

        {/* 9. Animation */}
        <ContentRow
          title="Animation"
          fetchHook={() => useGetByGenre('movie', GENRE_ANIMATION, 1)}
          type="movie"
          accent="#34d399"
        />

        {/* 10. Top-rated TV */}
        <ContentRow
          title="Critically Acclaimed Series"
          fetchHook={() => useGetTopRated('tv', 1)}
          type="tv"
          accent="#60a5fa"
        />
      </div>
    </Layout>
  );
};

export default Home;

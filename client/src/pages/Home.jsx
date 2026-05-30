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

const GENRE_ACTION  = 28;
const GENRE_COMEDY  = 35;

const Home = () => {
  // Hero: use trending all/day for a mixed feed
  const { data: trendingAllData } = useGetTrendingAll('day');

  return (
    <Layout>
      {/* ── Hero Banner ───────────────────────────────────── */}
      <HeroBanner movies={trendingAllData?.results || []} />

      {/* ── Content Rows ──────────────────────────────────── */}
      <div style={{ marginTop: '-80px', position: 'relative', zIndex: 20, paddingBottom: '40px' }}>

        {/* 1. 🔥 Trending Today — /trending/all/day */}
        <ContentRow
          title="🔥 Trending Today"
          fetchHook={() => useGetTrendingAll('day')}
          type="movie"
          isLarge={true}
        />

        {/* 2. ⭐ Top Rated Movies — /movie/top_rated */}
        <ContentRow
          title="⭐ Top Rated Movies"
          fetchHook={() => useGetTopRated('movie', 1)}
          type="movie"
        />

        {/* 3. 📺 Popular TV Shows — /tv/popular */}
        <ContentRow
          title="📺 Popular TV Shows"
          fetchHook={() => useGetPopular('tv', 1)}
          type="tv"
        />

        {/* 4. 🆕 New Releases — /movie/now_playing */}
        <ContentRow
          title="🆕 New Releases"
          fetchHook={() => useGetNowPlaying(1)}
          type="movie"
        />

        {/* 5. 🎭 Action & Adventure — /discover/movie?with_genres=28 */}
        <ContentRow
          title="🎭 Action & Adventure"
          fetchHook={() => useGetByGenre('movie', GENRE_ACTION, 1)}
          type="movie"
        />

        {/* 6. 😂 Comedy — /discover/movie?with_genres=35 */}
        <ContentRow
          title="😂 Comedy"
          fetchHook={() => useGetByGenre('movie', GENRE_COMEDY, 1)}
          type="movie"
        />

      </div>
    </Layout>
  );
};

export default Home;

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaInfoCircle, FaStar, FaVolumeUp, FaVolumeMute } from 'react-icons/fa';
import { getImageURL, formatRating } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useUIStore } from '../../store/uiStore';

const GENRE_MAP = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  18: 'Drama', 14: 'Fantasy', 27: 'Horror', 9648: 'Mystery', 10749: 'Romance',
  878: 'Sci-Fi', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

const HeroBanner = ({ movies }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFading, setIsFading]         = useState(false);
  const [muted, setMuted]               = useState(true);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { openDetail } = useUIStore();

  const TOTAL = Math.min(movies?.length ?? 0, 8);

  const goTo = useCallback((idx) => {
    setIsFading(true);
    setTimeout(() => {
      setCurrentIndex(idx);
      setIsFading(false);
    }, 450);
  }, []);

  useEffect(() => {
    if (TOTAL === 0) return;
    const id = setInterval(() => {
      goTo((currentIndex + 1) % TOTAL);
    }, 9000);
    return () => clearInterval(id);
  }, [currentIndex, TOTAL, goTo]);

  if (!movies || movies.length === 0) {
    return (
      <div className="w-full h-[90vh] bg-ns-dark animate-pulse" style={{ minHeight: 600 }} />
    );
  }

  const movie   = movies[currentIndex];
  const inList  = isInWatchlist(movie.id);
  const title   = movie.title || movie.name;
  const year    = (movie.release_date || movie.first_air_date)?.slice(0, 4);
  const genres  = (movie.genre_ids || []).slice(0, 3).map((id) => GENRE_MAP[id]).filter(Boolean);
  const rating  = formatRating(movie.vote_average);
  const overview = movie.overview?.length > 200
    ? movie.overview.slice(0, 197) + '…'
    : movie.overview;

  const toggleWatchlist = () => {
    if (inList) removeFromWatchlist(movie.id, movie.media_type || 'movie');
    else addToWatchlist(movie, movie.media_type || 'movie');
  };

  return (
    <div
      className="relative w-full overflow-hidden text-white select-none"
      style={{ height: '85vh', minHeight: 560, maxHeight: 880 }}
    >
      {/* ── Backdrop ─────────────────────────────────────────── */}
      <div
        className="absolute inset-0"
        style={{
          opacity:    isFading ? 0 : 1,
          transition: 'opacity 0.45s ease-in-out',
        }}
      >
        <img
          key={movie.id}
          src={getImageURL(movie.backdrop_path, 'original')}
          alt={title}
          className="w-full h-full object-cover object-top"
          draggable={false}
        />

        {/* left fade */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(105deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.65) 45%, transparent 75%)',
          }}
        />
        {/* bottom vignette — bleeds into content */}
        <div
          className="absolute bottom-0 left-0 w-full"
          style={{
            height: '55%',
            background:
              'linear-gradient(to top, #0a0a0a 0%, rgba(10,10,10,0.85) 40%, transparent 100%)',
          }}
        />
        {/* top vignette — covers navbar area */}
        <div
          className="absolute top-0 left-0 w-full"
          style={{
            height: '22%',
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.6) 0%, transparent 100%)',
          }}
        />
      </div>

      {/* ── Content ──────────────────────────────────────────── */}
      <div
        className="absolute left-0 bottom-0 w-full md:w-[62%] lg:w-[52%]"
        style={{
          padding:     '0 4% 9%',
          zIndex:      10,
          opacity:     isFading ? 0 : 1,
          transform:   isFading ? 'translateY(14px)' : 'translateY(0)',
          transition:  'opacity 0.45s ease, transform 0.45s ease',
        }}
      >
        {/* Maturity + Genre chips */}
        <div className="flex items-center flex-wrap gap-2 mb-3">
          <span
            style={{
              border: '1px solid rgba(255,255,255,0.45)',
              borderRadius: 3,
              padding: '1px 7px',
              fontSize: '0.7rem',
              fontWeight: 700,
              letterSpacing: '0.06em',
              color: 'rgba(255,255,255,0.8)',
            }}
          >
            PG-13
          </span>
          {genres.map((g) => (
            <span
              key={g}
              style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: 12,
                padding: '2px 10px',
                fontSize: '0.7rem',
                fontWeight: 600,
                color: 'rgba(255,255,255,0.75)',
                backdropFilter: 'blur(4px)',
              }}
            >
              {g}
            </span>
          ))}
        </div>

        {/* Title */}
        <h1
          style={{
            fontSize:      'clamp(2rem, 5vw, 3.8rem)',
            fontWeight:    900,
            lineHeight:    1.05,
            letterSpacing: '-0.02em',
            textShadow:    '0 2px 18px rgba(0,0,0,0.6)',
            marginBottom:  '0.6rem',
          }}
        >
          {title}
        </h1>

        {/* Meta row */}
        <div
          className="flex items-center flex-wrap gap-3 mb-4"
          style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.75)' }}
        >
          <span className="flex items-center gap-1.5">
            <FaStar style={{ color: '#f59e0b', fontSize: '0.75rem' }} />
            <span style={{ color: '#4ade80', fontWeight: 700 }}>{rating}</span>
            <span style={{ color: 'rgba(255,255,255,0.4)' }}>/10</span>
          </span>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>•</span>
          {year && <span style={{ fontWeight: 600 }}>{year}</span>}
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>•</span>
          <span style={{ textTransform: 'capitalize' }}>{movie.media_type || 'Movie'}</span>
        </div>

        {/* Overview */}
        <p
          className="mb-7 hidden sm:block"
          style={{
            fontSize:   'clamp(0.85rem, 1.3vw, 1rem)',
            lineHeight:  1.6,
            color:       'rgba(255,255,255,0.8)',
            maxWidth:    480,
            textShadow:  '0 1px 8px rgba(0,0,0,0.5)',
          }}
        >
          {overview}
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Play */}
          <Link
            to={`/${movie.media_type === 'tv' ? 'tv' : 'movie'}/${movie.id}`}
            style={{
              display:        'flex',
              alignItems:     'center',
              gap:            '8px',
              background:     '#ffffff',
              color:          '#000000',
              padding:        '10px 26px',
              borderRadius:   6,
              fontWeight:     700,
              fontSize:       '0.95rem',
              textDecoration: 'none',
              letterSpacing:  '0.01em',
              transition:     'background 0.2s ease, transform 0.15s ease',
              whiteSpace:     'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.85)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = '#ffffff'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <FaPlay style={{ fontSize: '0.85rem' }} />
            Play
          </Link>

          {/* More Info */}
          <button
            onClick={() => openDetail(movie, movie.media_type || 'movie')}
            style={{
              display:     'flex',
              alignItems:  'center',
              gap:         '8px',
              background:  'rgba(109,109,110,0.7)',
              color:       '#ffffff',
              padding:     '10px 22px',
              borderRadius: 6,
              fontWeight:  700,
              fontSize:    '0.95rem',
              border:      'none',
              cursor:      'pointer',
              backdropFilter: 'blur(6px)',
              transition:  'background 0.2s ease, transform 0.15s ease',
              whiteSpace:  'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(109,109,110,0.9)'; e.currentTarget.style.transform = 'scale(1.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(109,109,110,0.7)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            <FaInfoCircle style={{ fontSize: '1rem' }} />
            More Info
          </button>

          {/* My List */}
          <button
            onClick={toggleWatchlist}
            title={inList ? 'Remove from My List' : 'Add to My List'}
            style={{
              width:        42,
              height:       42,
              borderRadius: '50%',
              background:   'rgba(42,42,42,0.7)',
              border:       '2px solid rgba(255,255,255,0.5)',
              color:        '#ffffff',
              display:      'flex',
              alignItems:   'center',
              justifyContent: 'center',
              cursor:       'pointer',
              transition:   'border-color 0.2s ease, transform 0.15s ease',
              flexShrink:   0,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.transform = 'scale(1)'; }}
          >
            {inList
              ? <FaCheck  style={{ fontSize: '0.85rem', color: '#4ade80' }} />
              : <FaPlus   style={{ fontSize: '0.85rem' }} />
            }
          </button>
        </div>
      </div>

      {/* ── Mute toggle ──────────────────────────────────────── */}
      <button
        onClick={() => setMuted((m) => !m)}
        style={{
          position:     'absolute',
          right:        '4%',
          bottom:       '9%',
          zIndex:       20,
          width:        38,
          height:       38,
          borderRadius: '50%',
          background:   'rgba(42,42,42,0.7)',
          border:       '1.5px solid rgba(255,255,255,0.4)',
          color:        '#fff',
          display:      'flex',
          alignItems:   'center',
          justifyContent: 'center',
          cursor:       'pointer',
          transition:   'border-color 0.2s ease',
        }}
        onMouseEnter={e => e.currentTarget.style.borderColor = '#fff'}
        onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.4)'}
        aria-label={muted ? 'Unmute' : 'Mute'}
      >
        {muted
          ? <FaVolumeMute style={{ fontSize: '0.85rem' }} />
          : <FaVolumeUp   style={{ fontSize: '0.85rem' }} />
        }
      </button>

      {/* ── Slide indicator dots ─────────────────────────────── */}
      {TOTAL > 1 && (
        <div
          style={{
            position:       'absolute',
            bottom:         '6.5%',
            right:          '4%',
            marginRight:    52,
            zIndex:         20,
            display:        'flex',
            alignItems:     'center',
            gap:            6,
          }}
        >
          {Array.from({ length: TOTAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              style={{
                width:        i === currentIndex ? 22 : 6,
                height:       6,
                borderRadius: 3,
                background:   i === currentIndex ? '#e50914' : 'rgba(255,255,255,0.35)',
                border:       'none',
                cursor:       'pointer',
                padding:      0,
                transition:   'width 0.35s ease, background 0.35s ease',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default HeroBanner;

import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '../Cards/MovieCard';

/**
 * Netflix-style horizontal scrolling content row
 */
const ContentRow = ({ title, fetchHook, type = 'movie', isLarge = false }) => {
  const rowRef         = useRef(null);
  const [rowHovered, setRowHovered] = useState(false);
  const [atStart,    setAtStart]    = useState(true);
  const [atEnd,      setAtEnd]      = useState(false);

  const { data, isLoading, error } = fetchHook();

  const items = data?.results || [];

  /* ── scroll helpers ─────────────────────────────────────── */
  const updateEdges = () => {
    const el = rowRef.current;
    if (!el) return;
    setAtStart(el.scrollLeft <= 4);
    setAtEnd(el.scrollLeft + el.clientWidth >= el.scrollWidth - 4);
  };

  const scroll = (dir) => {
    const el = rowRef.current;
    if (!el) return;
    const amount = el.clientWidth * 0.75;
    el.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  if (error) return null;
  if (!isLoading && items.length === 0) return null;

  return (
    <div
      style={{ padding: '8px 0 24px', position: 'relative' }}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* ── ROW HEADER ─────────────────────────────────────── */}
      <div style={{
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        padding:        '0 4% 12px',
      }}>
        <h2 style={{
          color:       '#ffffff',
          fontSize:    '1.3rem',
          fontWeight:  700,
          margin:      0,
          letterSpacing: '0.01em',
        }}>
          {title}
        </h2>

        {/* "See All →" — only on row hover */}
        <Link
          to={`/${type === 'tv' ? 'tv' : 'movies'}`}
          style={{
            color:          '#E50914',
            fontSize:       '0.82rem',
            fontWeight:     600,
            textDecoration: 'none',
            letterSpacing:  '0.04em',
            display:        'flex',
            alignItems:     'center',
            gap:            '4px',
            opacity:        rowHovered ? 1 : 0,
            transform:      rowHovered ? 'translateX(0)' : 'translateX(-6px)',
            transition:     'opacity 0.25s ease, transform 0.25s ease',
            pointerEvents:  rowHovered ? 'auto' : 'none',
          }}
        >
          See All <span style={{ fontSize: '0.7rem' }}>›</span>
        </Link>
      </div>

      {/* ── SCROLL CONTAINER WRAPPER ────────────────────────── */}
      <div style={{ position: 'relative' }}>

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{
            ...arrowStyle,
            left:    0,
            background: 'linear-gradient(to right, rgba(15,15,15,0.95) 40%, transparent)',
            opacity: (rowHovered && !atStart) ? 1 : 0,
            pointerEvents: (rowHovered && !atStart) ? 'auto' : 'none',
          }}
        >
          <FaChevronLeft size={20} style={{ color: '#fff', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }} />
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{
            ...arrowStyle,
            right:   0,
            background: 'linear-gradient(to left, rgba(15,15,15,0.95) 40%, transparent)',
            opacity: (rowHovered && !atEnd) ? 1 : 0,
            pointerEvents: (rowHovered && !atEnd) ? 'auto' : 'none',
          }}
        >
          <FaChevronRight size={20} style={{ color: '#fff', filter: 'drop-shadow(0 0 4px rgba(0,0,0,0.8))' }} />
        </button>

        {/* ── SCROLLABLE TRACK ──────────────────────────────── */}
        <div
          ref={rowRef}
          onScroll={updateEdges}
          style={{
            display:              'grid',
            gridAutoFlow:         'column',
            gridAutoColumns:      'calc(100% / 6.5)',  /* ~6 visible on desktop */
            gap:                  '8px',
            overflowX:            'auto',
            overflowY:            'visible',
            padding:              '16px 4% 20px',      /* top/bottom padding for hover scale */
            scrollbarWidth:       'none',
            msOverflowStyle:      'none',
            scrollSnapType:       'x mandatory',
            WebkitOverflowScrolling: 'touch',
          }}
          className="ns-content-track"
        >
          {isLoading
            /* ── SKELETON ────────────────────────────── */
            ? Array.from({ length: 12 }).map((_, i) => (
                <SkeletonCard key={i} />
              ))
            /* ── REAL CARDS ──────────────────────────── */
            : items.map((item) => (
                <div
                  key={item.id}
                  style={{
                    scrollSnapAlign: 'start',
                    minWidth:        0,            /* critical for grid overflow */
                  }}
                >
                  <MovieCard item={item} mediaType={type} isLarge={isLarge} />
                </div>
              ))
          }
        </div>
      </div>

      {/* ── RESPONSIVE OVERRIDES ───────────────────────────── */}
      <style>{`
        .ns-content-track::-webkit-scrollbar { display: none; }

        /* Desktop: 6 cards */
        .ns-content-track {
          grid-auto-columns: calc((100% - 4% * 2 - 8px * 5) / 6);
        }
        /* Tablet: 4 cards */
        @media (max-width: 1024px) {
          .ns-content-track {
            grid-auto-columns: calc((100% - 4% * 2 - 8px * 3) / 4);
          }
        }
        /* Mobile: 2.5 cards (hint of next) */
        @media (max-width: 640px) {
          .ns-content-track {
            grid-auto-columns: calc((100% - 4% * 2 - 8px * 1.5) / 2.5);
          }
        }
      `}</style>
    </div>
  );
};

/* ── Skeleton card ─────────────────────────────────────────── */
const SkeletonCard = () => (
  <div
    style={{
      aspectRatio:  '2 / 3',
      borderRadius: '6px',
      overflow:     'hidden',
      position:     'relative',
    }}
  >
    <div className="ns-shimmer" style={{ width: '100%', height: '100%' }} />
    <style>{`
      .ns-shimmer {
        background: linear-gradient(90deg, #1a1a1a 0%, #2a2a2a 50%, #1a1a1a 100%);
        background-size: 200% 100%;
        animation: ns-shimmer-anim 1.6s ease-in-out infinite;
      }
      @keyframes ns-shimmer-anim {
        0%   { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    `}</style>
  </div>
);

/* ── Arrow button base styles ──────────────────────────────── */
const arrowStyle = {
  position:        'absolute',
  top:             0,
  bottom:          0,
  zIndex:          10,
  width:           '72px',
  border:          'none',
  cursor:          'pointer',
  display:         'flex',
  alignItems:      'center',
  justifyContent:  'center',
  transition:      'opacity 0.25s ease',
  padding:         0,
};

export default ContentRow;

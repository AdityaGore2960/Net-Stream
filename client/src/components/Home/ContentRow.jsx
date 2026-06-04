import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import MovieCard from '../Cards/MovieCard';

/**
 * Netflix-style horizontal scrolling content row
 */
const ContentRow = ({ title, fetchHook, type = 'movie', isLarge = false, accent }) => {
  const rowRef                              = useRef(null);
  const [rowHovered,  setRowHovered]        = useState(false);
  const [atStart,     setAtStart]           = useState(true);
  const [atEnd,       setAtEnd]             = useState(false);
  const [titleHovered, setTitleHovered]     = useState(false);

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
    el.scrollBy({ left: dir === 'right' ? el.clientWidth * 0.78 : -(el.clientWidth * 0.78), behavior: 'smooth' });
  };

  if (error) return null;
  if (!isLoading && items.length === 0) return null;

  const accentColor = accent || '#e50914';

  return (
    <div
      style={{ padding: '4px 0 28px', position: 'relative' }}
      onMouseEnter={() => setRowHovered(true)}
      onMouseLeave={() => setRowHovered(false)}
    >
      {/* ── ROW HEADER ────────────────────────────────────────── */}
      <div
        style={{
          display:        'flex',
          alignItems:     'center',
          justifyContent: 'space-between',
          padding:        '0 4% 14px',
        }}
      >
        {/* Title with animated accent underline */}
        <Link
          to={`/${type === 'tv' ? 'tv' : 'movies'}`}
          style={{ textDecoration: 'none' }}
          onMouseEnter={() => setTitleHovered(true)}
          onMouseLeave={() => setTitleHovered(false)}
        >
          <div style={{ position: 'relative', display: 'inline-block' }}>
            <h2
              style={{
                color:         titleHovered ? accentColor : '#ffffff',
                fontSize:      'clamp(1rem, 1.8vw, 1.35rem)',
                fontWeight:    700,
                margin:        0,
                letterSpacing: '0.01em',
                transition:    'color 0.25s ease',
                display:       'flex',
                alignItems:    'center',
                gap:           8,
              }}
            >
              {title}
              {/* Netflix-style "Explore All" chevron that slides in on hover */}
              <span
                style={{
                  display:    'flex',
                  alignItems: 'center',
                  gap:        3,
                  opacity:    titleHovered ? 1 : 0,
                  transform:  titleHovered ? 'translateX(0)' : 'translateX(-8px)',
                  transition: 'opacity 0.25s ease, transform 0.25s ease',
                  fontSize:   '0.75rem',
                  fontWeight: 600,
                  color:      accentColor,
                  whiteSpace: 'nowrap',
                }}
              >
                Explore All <FaChevronRight style={{ fontSize: '0.6rem' }} />
              </span>
            </h2>
            {/* Animated underline */}
            <div
              style={{
                position:   'absolute',
                bottom:     -3,
                left:       0,
                height:     2,
                width:      titleHovered ? '100%' : '0%',
                background: accentColor,
                borderRadius: 2,
                transition: 'width 0.3s ease',
              }}
            />
          </div>
        </Link>
      </div>

      {/* ── SCROLL CONTAINER WRAPPER ──────────────────────────── */}
      <div style={{ position: 'relative' }}>

        {/* LEFT ARROW */}
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll left"
          style={{
            ...arrowBase,
            left:       0,
            background: 'linear-gradient(to right, rgba(10,10,10,0.97) 35%, rgba(10,10,10,0.5) 75%, transparent)',
            opacity:    (rowHovered && !atStart) ? 1 : 0,
            pointerEvents: (rowHovered && !atStart) ? 'auto' : 'none',
          }}
        >
          <div style={arrowIconWrap}>
            <FaChevronLeft size={18} style={{ color: '#fff' }} />
          </div>
        </button>

        {/* RIGHT ARROW */}
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll right"
          style={{
            ...arrowBase,
            right:      0,
            background: 'linear-gradient(to left, rgba(10,10,10,0.97) 35%, rgba(10,10,10,0.5) 75%, transparent)',
            opacity:    (rowHovered && !atEnd) ? 1 : 0,
            pointerEvents: (rowHovered && !atEnd) ? 'auto' : 'none',
          }}
        >
          <div style={arrowIconWrap}>
            <FaChevronRight size={18} style={{ color: '#fff' }} />
          </div>
        </button>

        {/* ── SCROLLABLE TRACK ──────────────────────────────────── */}
        <div
          ref={rowRef}
          onScroll={updateEdges}
          style={{
            display:              'grid',
            gridAutoFlow:         'column',
            gap:                  '6px',
            overflowX:            'auto',
            overflowY:            'visible',
            padding:              '20px 4% 24px',
            scrollbarWidth:       'none',
            msOverflowStyle:      'none',
            WebkitOverflowScrolling: 'touch',
          }}
          className="ns-content-track"
        >
          {isLoading
            ? Array.from({ length: 10 }).map((_, i) => <SkeletonCard key={i} isLarge={isLarge} />)
            : items.map((item) => (
                <div
                  key={item.id}
                  style={{ scrollSnapAlign: 'start', minWidth: 0 }}
                >
                  <MovieCard item={item} mediaType={type} isLarge={isLarge} />
                </div>
              ))
          }
        </div>
      </div>

      {/* ── RESPONSIVE OVERRIDES ────────────────────────────────── */}
      <style>{`
        .ns-content-track::-webkit-scrollbar { display: none; }

        /* Desktop ≥1280 — 6 cards */
        .ns-content-track {
          grid-auto-columns: calc((100% - 8% - 6px * 5) / 6);
        }
        /* Laptop 1024–1279 — 5 cards */
        @media (max-width: 1279px) and (min-width: 1024px) {
          .ns-content-track {
            grid-auto-columns: calc((100% - 8% - 6px * 4) / 5);
          }
        }
        /* Tablet 640–1023 — 3.5 cards */
        @media (max-width: 1023px) and (min-width: 640px) {
          .ns-content-track {
            grid-auto-columns: calc((100% - 8% - 6px * 2.5) / 3.5);
          }
        }
        /* Mobile <640 — 2.3 cards */
        @media (max-width: 639px) {
          .ns-content-track {
            grid-auto-columns: calc((100% - 8% - 6px * 1.3) / 2.3);
          }
        }
      `}</style>
    </div>
  );
};

/* ── Skeleton card ──────────────────────────────────────────── */
const SkeletonCard = ({ isLarge }) => (
  <div
    style={{
      aspectRatio:  isLarge ? '2 / 3' : '2 / 3',
      borderRadius: '6px',
      overflow:     'hidden',
      background:   'linear-gradient(90deg, #181818 0%, #242424 50%, #181818 100%)',
      backgroundSize: '200% 100%',
      animation:    'ns-shimmer 1.6s ease-in-out infinite',
    }}
  />
);

/* ── Arrow base styles ──────────────────────────────────────── */
const arrowBase = {
  position:       'absolute',
  top:            0,
  bottom:         0,
  zIndex:         10,
  width:          '80px',
  border:         'none',
  cursor:         'pointer',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  transition:     'opacity 0.25s ease',
  padding:        0,
};

const arrowIconWrap = {
  width:          36,
  height:         36,
  borderRadius:   '50%',
  background:     'rgba(30,30,30,0.8)',
  border:         '1.5px solid rgba(255,255,255,0.2)',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  backdropFilter: 'blur(4px)',
};

export default ContentRow;

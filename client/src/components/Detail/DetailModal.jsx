import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaTimes, FaPlay, FaPlus, FaCheck, FaStar,
  FaThumbsUp, FaVolumeUp, FaVolumeMute
} from 'react-icons/fa';
import { useUIStore } from '../../store/uiStore';
import { useGetDetails, useWatchProviders } from '../../hooks/useMovies';
import { getImageURL, formatRating, formatRuntime } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import MovieCard from '../Cards/MovieCard';

/**
 * Premium Netflix-style Detail Modal
 */
const DetailModal = () => {
  const { isDetailOpen, selectedItem, selectedType, closeDetail } = useUIStore();
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const overlayRef = useRef(null);
  const navigate = useNavigate();

  const mediaType = selectedType || (selectedItem?.media_type === 'tv' ? 'tv' : 'movie');
  const itemId = selectedItem?.id;

  /* ── Fetch full details ────────────────────────────────── */
  const { data: details, isLoading } = useGetDetails(mediaType, itemId);
  const { data: providers } = useWatchProviders(mediaType, itemId);
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();

  const inList = itemId ? isInWatchlist(itemId) : false;

  /* ── Animate in/out ────────────────────────────────────── */
  useEffect(() => {
    if (isDetailOpen) {
      setMounted(true);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true)));
    } else {
      setVisible(false);
      document.body.style.overflow = '';
      const t = setTimeout(() => setMounted(false), 350);
      return () => clearTimeout(t);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isDetailOpen]);

  /* ── ESC key ───────────────────────────────────────────── */
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') closeDetail(); };
    if (isDetailOpen) window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isDetailOpen, closeDetail]);

  if (!mounted || !selectedItem) return null;

  /* ── Data helpers ──────────────────────────────────────── */
  const item = details || selectedItem;
  const title = item.title || item.name || '';
  const year = (item.release_date || item.first_air_date)?.slice(0, 4) || '';
  const rating = formatRating(item.vote_average);
  const runtime = item.runtime ? formatRuntime(item.runtime) : item.episode_run_time?.[0] ? `${item.episode_run_time[0]}m/ep` : null;
  const match = Math.floor((item.vote_average / 10) * 100);
  const overview = item.overview || '';
  const genres = item.genres?.map(g => g.name) || [];

  /* ── Cast & crew ───────────────────────────────────────── */
  const cast = item.credits?.cast?.slice(0, 6) || [];
  const director = item.credits?.crew?.find(c => c.job === 'Director')?.name
    || item.created_by?.[0]?.name || null;

  /* ── Similar ───────────────────────────────────────────── */
  const similar = item.similar?.results?.slice(0, 6)
    || item.recommendations?.results?.slice(0, 6) || [];

  /* ── Watch providers (IN region) ───────────────────────── */
  const watchProviders = providers?.results?.IN?.flatrate
    || providers?.results?.US?.flatrate || [];

  const handleWatchlist = () => {
    if (inList) removeFromWatchlist(selectedItem.id, mediaType);
    else addToWatchlist(selectedItem, mediaType);
  };

  const handlePlay = () => {
    closeDetail();
    navigate(`/${mediaType}/${selectedItem.id}`);
  };

  return (
    <>
      {/* ── BACKDROP OVERLAY ─────────────────────────────── */}
      <div
        ref={overlayRef}
        onClick={(e) => { if (e.target === overlayRef.current) closeDetail(); }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 2000,
          background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(6px)',
          WebkitBackdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          overflowY: 'auto',
          padding: '40px 16px 60px',
          opacity: visible ? 1 : 0,
          transition: 'opacity 0.35s ease',
        }}
      >
        {/* ── MODAL CARD ──────────────────────────────────── */}
        <div
          style={{
            width: '100%',
            maxWidth: '850px',
            background: '#181818',
            borderRadius: '12px',
            overflow: 'hidden',
            position: 'relative',
            transform: visible ? 'scale(1)' : 'scale(0.95)',
            opacity: visible ? 1 : 0,
            transition: 'transform 0.35s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.35s ease',
            boxShadow: '0 32px 80px rgba(0,0,0,0.9)',
            flexShrink: 0,
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* ─── CLOSE BUTTON ─────────────────────────────── */}
          <button
            onClick={closeDetail}
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              zIndex: 10,
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              background: 'rgba(20,20,20,0.9)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1rem',
              transition: 'background 0.2s ease, transform 0.2s ease',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = 'rgba(50,50,50,0.95)'; e.currentTarget.style.transform = 'scale(1.1)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(20,20,20,0.9)'; e.currentTarget.style.transform = 'scale(1)'; }}
            aria-label="Close"
          >
            <FaTimes />
          </button>

          {/* ─── HERO IMAGE SECTION ───────────────────────── */}
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#111' }}>
            {(item.backdrop_path || selectedItem.backdrop_path) && (
              <img
                src={getImageURL(item.backdrop_path || selectedItem.backdrop_path, 'w1280')}
                alt={title}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            )}

            {/* Multi-layer gradients */}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, #181818 0%, rgba(24,24,24,0.6) 50%, transparent 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, transparent 60%)' }} />

            {/* Title + buttons on image */}
            <div style={{ position: 'absolute', bottom: '24px', left: '28px', right: '60px' }}>
              <h1 style={{
                color: '#fff',
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 3.5vw, 2.2rem)',
                lineHeight: 1.15,
                marginBottom: '16px',
                textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              }}>
                {title}
              </h1>

              {/* CTA Buttons */}
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <button
                  onClick={handlePlay}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: '#fff', color: '#000',
                    border: 'none', borderRadius: '6px',
                    padding: '10px 24px', fontWeight: 700, fontSize: '0.95rem',
                    cursor: 'pointer', transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.85)'}
                  onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                >
                  <FaPlay style={{ fontSize: '0.8rem' }} /> Play
                </button>

                <button
                  onClick={handleWatchlist}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '8px',
                    background: 'rgba(255,255,255,0.15)',
                    backdropFilter: 'blur(8px)',
                    color: '#fff',
                    border: '1px solid rgba(255,255,255,0.35)',
                    borderRadius: '6px',
                    padding: '10px 20px', fontWeight: 600, fontSize: '0.9rem',
                    cursor: 'pointer', transition: 'background 0.2s ease',
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.25)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.15)'}
                >
                  {inList ? <FaCheck style={{ color: '#4ade80' }} /> : <FaPlus />}
                  {inList ? 'In My List' : 'My List'}
                </button>
              </div>
            </div>
          </div>

          {/* ─── META BADGES ──────────────────────────────── */}
          <div style={{ padding: '20px 28px 4px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Match score */}
            <span style={{
              color: '#4ade80', fontWeight: 700, fontSize: '0.95rem',
            }}>
              {match}% Match
            </span>

            {/* Star rating */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: '4px',
              background: 'rgba(251,191,36,0.12)',
              border: '1px solid rgba(251,191,36,0.3)',
              borderRadius: '5px', padding: '3px 8px',
            }}>
              <FaStar style={{ color: '#fbbf24', fontSize: '0.7rem' }} />
              <span style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.82rem' }}>{rating}</span>
            </div>

            {/* Year */}
            {year && <span style={{ color: '#a3a3a3', fontSize: '0.85rem' }}>{year}</span>}

            {/* Runtime */}
            {runtime && (
              <span style={{
                color: '#a3a3a3', fontSize: '0.82rem',
                border: '1px solid rgba(255,255,255,0.15)',
                borderRadius: '4px', padding: '2px 7px',
              }}>
                {runtime}
              </span>
            )}

            {/* HD badge */}
            <span style={{
              color: '#a3a3a3', fontSize: '0.72rem', fontWeight: 600,
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '3px', padding: '2px 6px', letterSpacing: '0.04em',
            }}>
              HD
            </span>
          </div>

          {/* ─── TWO-COLUMN BODY ──────────────────────────── */}
          <div style={{ padding: '16px 28px 24px', display: 'grid', gridTemplateColumns: '1fr 0.55fr', gap: '28px' }}
            className="ns-modal-body">

            {/* LEFT: Overview */}
            <div>
              {isLoading ? (
                <div style={{ height: '80px', borderRadius: '6px', background: '#2a2a2a', animation: 'shimmer 1.5s infinite' }} />
              ) : (
                <p style={{ color: '#d4d4d4', lineHeight: 1.7, fontSize: '0.92rem', margin: 0 }}>{overview}</p>
              )}
            </div>

            {/* RIGHT: Cast / Genre / Director */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cast.length > 0 && (
                <div>
                  <span style={{ color: '#737373', fontSize: '0.82rem' }}>Cast: </span>
                  <span style={{ color: '#d4d4d4', fontSize: '0.82rem' }}>
                    {cast.map(c => c.name).join(', ')}
                  </span>
                </div>
              )}
              {genres.length > 0 && (
                <div>
                  <span style={{ color: '#737373', fontSize: '0.82rem' }}>Genres: </span>
                  <span style={{ color: '#d4d4d4', fontSize: '0.82rem' }}>{genres.join(', ')}</span>
                </div>
              )}
              {director && (
                <div>
                  <span style={{ color: '#737373', fontSize: '0.82rem' }}>Director: </span>
                  <span style={{ color: '#d4d4d4', fontSize: '0.82rem' }}>{director}</span>
                </div>
              )}
            </div>
          </div>

          {/* ─── WATCH ON (Platforms) ─────────────────────── */}
          {watchProviders.length > 0 && (
            <div style={{ padding: '0 28px 28px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '12px' }}>
                Watch On
              </h3>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {watchProviders.map(p => (
                  <div key={p.provider_id} style={{ textAlign: 'center' }}>
                    <img
                      src={getImageURL(p.logo_path, 'w92')}
                      alt={p.provider_name}
                      title={p.provider_name}
                      style={{
                        width: '42px', height: '42px',
                        borderRadius: '8px', objectFit: 'cover',
                        border: '1px solid rgba(255,255,255,0.12)',
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ─── MORE LIKE THIS ───────────────────────────── */}
          {similar.length > 0 && (
            <div style={{ padding: '4px 28px 32px' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '14px' }}>
                More Like This
              </h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: '10px',
              }} className="ns-modal-similar">
                {similar.map(s => (
                  <div key={s.id} onClick={() => { closeDetail(); setTimeout(() => useUIStore.getState().openDetail(s, mediaType), 50); }}>
                    <MovieCard item={s} mediaType={mediaType} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive + shimmer styles */}
      <style>{`
        @keyframes shimmer {
          0%   { opacity: 0.4; }
          50%  { opacity: 0.8; }
          100% { opacity: 0.4; }
        }
        @media (max-width: 640px) {
          .ns-modal-body  { grid-template-columns: 1fr !important; }
          .ns-modal-similar { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </>
  );
};

export default DetailModal;

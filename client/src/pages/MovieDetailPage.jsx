import React, { useEffect, useCallback, useRef } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout/Layout';
import MovieDetail from '../components/Detail/MovieDetail';
import ContentRow from '../components/Home/ContentRow';
import { useGetDetails } from '../hooks/useMovies';
import { useTrailer } from '../hooks/useTrailer';
import { useUIStore } from '../store/uiStore';
import ReactPlayer from 'react-player/youtube';
import { FaTimes, FaArrowLeft, FaExpand } from 'react-icons/fa';

const MovieDetailPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const mediaType = location.pathname.includes('/tv/') ? 'tv' : 'movie';

  const { data, isLoading, error } = useGetDetails(mediaType, id);
  const { trailerKey } = useTrailer(mediaType, id);
  const {
    isTrailerOpen, closeTrailer,
    isPlayerOpen, closePlayer,
  } = useUIStore();

  const modalRef = useRef(null);
  const isModalOpen = isPlayerOpen || isTrailerOpen;

  /* ── Close on page navigation ────────────────────────────── */
  useEffect(() => {
    window.scrollTo(0, 0);
    closeTrailer();
    if (closePlayer) closePlayer();
  }, [id]);                              // eslint-disable-line react-hooks/exhaustive-deps

  /* ── Escape key ──────────────────────────────────────────────
     iframes steal keyboard focus, so we listen on window AND
     re-focus the modal div whenever blur fires (= focus entered
     the iframe), dragging focus back to the parent document.
  ─────────────────────────────────────────────────────────── */
  const handleEscape = useCallback((e) => {
    if (e.key !== 'Escape') return;
    if (isPlayerOpen && closePlayer) closePlayer();
    if (isTrailerOpen && closeTrailer) closeTrailer();
  }, [isPlayerOpen, isTrailerOpen, closePlayer, closeTrailer]);

  const reclaim = useCallback(() => {
    /* When focus drifts into the iframe, pull it back after 100 ms */
    if (isModalOpen && modalRef.current) {
      setTimeout(() => modalRef.current?.focus(), 100);
    }
  }, [isModalOpen]);

  useEffect(() => {
    if (!isModalOpen) return;
    window.addEventListener('keydown', handleEscape);
    window.addEventListener('blur', reclaim);
    return () => {
      window.removeEventListener('keydown', handleEscape);
      window.removeEventListener('blur', reclaim);
    };
  }, [isModalOpen, handleEscape, reclaim]);

  /* Auto-focus on open */
  useEffect(() => {
    if (isModalOpen && modalRef.current) modalRef.current.focus();
  }, [isModalOpen]);

  /* ── Embed URL ───────────────────────────────────────────── */
  const getEmbedUrl = () => {
    // Using vidsrc.me as a highly reliable streaming fallback
    return mediaType === 'tv'
      ? `https://vidsrc.me/embed/tv?tmdb=${id}&season=1&episode=1`
      : `https://vidsrc.me/embed/movie?tmdb=${id}`;
  };

  /* ── Loading / error ─────────────────────────────────────── */
  if (isLoading) {
    return (
      <Layout>
        <div className="w-full h-screen bg-ns-black flex items-center justify-center">
          <div className="w-16 h-16 border-4 border-ns-red border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !data) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <h1 className="text-3xl font-bold mb-4">Content Not Found</h1>
          <p className="text-ns-gray-1 text-lg">
            The movie or TV show you are looking for does not exist.
          </p>
        </div>
      </Layout>
    );
  }

  const fetchSimilar = () => ({ data: data.similar, isLoading: false, error: null });
  const fetchRecommendations = () => ({ data: data.recommendations, isLoading: false, error: null });

  const title = data?.title || data?.name || '';
  const year = (data?.release_date || data?.first_air_date)?.slice(0, 4);

  return (
    <Layout>
      <MovieDetail item={data} mediaType={mediaType} />

      <div className="pb-12 space-y-8 mt-4 relative z-10">
        {data.similar?.results?.length > 0 && (
          <ContentRow title="More Like This" fetchHook={fetchSimilar} type={mediaType} />
        )}
        {data.recommendations?.results?.length > 0 && (
          <ContentRow title="Recommendations" fetchHook={fetchRecommendations} type={mediaType} />
        )}
      </div>

      {/* ════════════════════════════════════════════════════════
          TRAILER MODAL
          z-index: 1100 — above Navbar (999) and everything else
      ════════════════════════════════════════════════════════ */}
      {isTrailerOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          onKeyDown={handleEscape}
          onClick={(e) => { if (e.target === e.currentTarget) closeTrailer(); }}
          style={overlay}
        >
          {/* ── Floating close button (top-right, always visible) ── */}
          <button
            onClick={closeTrailer}
            aria-label="Close trailer"
            style={floatingClose}
            onMouseEnter={e => Object.assign(e.currentTarget.style, floatingCloseHover)}
            onMouseLeave={e => Object.assign(e.currentTarget.style, floatingCloseBase)}
          >
            <FaTimes size={20} />
          </button>

          {/* ── Floating back button (top-left) ── */}
          <button
            onClick={closeTrailer}
            aria-label="Go back"
            style={floatingBack}
            onMouseEnter={e => e.currentTarget.style.color = '#fff'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
          >
            <FaArrowLeft size={16} style={{ marginRight: 8 }} />
            Back
          </button>

          {/* ── Player ── */}
          <div style={playerWrap}>
            {trailerKey ? (
              <ReactPlayer
                url={`https://www.youtube.com/watch?v=${trailerKey}`}
                width="100%"
                height="100%"
                playing={true}
                controls={true}
              />
            ) : (
              <div style={noMedia}>
                <p style={{ color: '#888', fontSize: '1.1rem' }}>Trailer not available</p>
              </div>
            )}
          </div>

          <p style={escHint}>
            Press <kbd style={kbd}>Esc</kbd> or click outside to close
          </p>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════
          VIDEO PLAYER MODAL
          z-index: 1100 — above Navbar (999) and everything else
      ════════════════════════════════════════════════════════ */}
      {isPlayerOpen && (
        <div
          ref={modalRef}
          tabIndex={-1}
          onKeyDown={handleEscape}
          style={{ ...overlay, background: '#000' }}
        >
          {/* ── Top bar (sits entirely above the iframe) ────────── */}
          <div style={topBar}>
            {/* Left: back + title */}
            <button
              onClick={closePlayer}
              aria-label="Go back"
              style={backBtn}
              onMouseEnter={e => e.currentTarget.style.color = '#fff'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
            >
              <FaArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="hidden md:flex flex-col items-center gap-[2px] absolute left-1/2 -translate-x-1/2 text-center w-[50%]">
              <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                You're Watching
              </span>
              <span className="truncate w-full" style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 700 }}>
                {title}{year ? ` (${year})` : ''}
              </span>
            </div>

            {/* Right: close ✕ */}
            <button
              onClick={closePlayer}
              aria-label="Close player"
              style={closeXBtn}
              onMouseEnter={e => Object.assign(e.currentTarget.style, floatingCloseHover)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, floatingCloseBase)}
            >
              <FaTimes size={20} />
            </button>
          </div>

          {/* ── iframe (below the top bar, never overlapping it) ── */}
          <div style={iframeWrap}>
            <iframe
              key={id}
              src={getEmbedUrl()}
              style={iframeStyle}
              allowFullScreen
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              title={`Watch ${title}`}
            />
          </div>

          {/* ── Esc hint ── */}
          <p style={escHint}>
            Press <kbd style={kbd}>Esc</kbd> to close
          </p>
        </div>
      )}
    </Layout>
  );
};

/* ═══════════════════════════════════════════════════════════════
   STYLES
   Key rule: overlay z-index (1100) MUST be > Navbar z-index (999)
═══════════════════════════════════════════════════════════════ */

/* Full-screen overlay — covers navbar completely */
const overlay = {
  position: 'fixed',
  inset: 0,
  zIndex: 1100,          /* > Navbar 999 */
  background: 'rgba(0,0,0,0.96)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  outline: 'none',
};

/* ── Floating close (✕) button — top-right, trailer modal ── */
const floatingCloseBase = {
  background: 'rgba(20,20,20,0.85)',
  borderColor: 'rgba(255,255,255,0.3)',
};
const floatingCloseHover = {
  background: '#e50914',
  borderColor: '#e50914',
};
const floatingClose = {
  position: 'fixed',
  top: 24,
  right: 28,
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 46,
  height: 46,
  borderRadius: '50%',
  background: 'rgba(20,20,20,0.85)',
  border: '1.5px solid rgba(255,255,255,0.3)',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s ease, border-color 0.2s ease, transform 0.15s ease',
  backdropFilter: 'blur(8px)',
};

/* ── Floating back button — top-left, trailer modal ── */
const floatingBack = {
  position: 'fixed',
  top: 24,
  left: 24,
  zIndex: 1200,
  display: 'flex',
  alignItems: 'center',
  gap: 6,
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
};

/* ── Top bar — player modal (sits ABOVE the iframe) ── */
const topBar = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: '14px 24px',
  flexShrink: 0,
  background: 'linear-gradient(to bottom, rgba(0,0,0,0.9) 0%, transparent 100%)',
  position: 'relative',
  zIndex: 1200,
};

const backBtn = {
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  background: 'none',
  border: 'none',
  color: 'rgba(255,255,255,0.7)',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'color 0.2s ease',
  flexShrink: 0,
};

/* Circular ✕ button — top-right, player modal */
const closeXBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 46,
  height: 46,
  borderRadius: '50%',
  background: 'rgba(20,20,20,0.85)',
  border: '1.5px solid rgba(255,255,255,0.3)',
  color: '#fff',
  cursor: 'pointer',
  transition: 'background 0.2s ease, border-color 0.2s ease',
  backdropFilter: 'blur(8px)',
  flexShrink: 0,
};

/* iframe container */
const iframeWrap = {
  width: '100%',
  flex: 1,
  padding: '0 0 8px',
  minHeight: 0,
};

const iframeStyle = {
  width: '100%',
  height: '100%',
  border: 'none',
  display: 'block',
};

const playerWrap = {
  width: '100%',
  maxWidth: '72rem',
  aspectRatio: '16/9',
  padding: '0 16px',
};

const noMedia = {
  width: '100%', height: '100%',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: '#111', borderRadius: 8,
};

const escHint = {
  color: 'rgba(255,255,255,0.25)',
  fontSize: '0.72rem',
  marginTop: 10,
  flexShrink: 0,
};

const kbd = {
  background: 'rgba(255,255,255,0.1)',
  padding: '1px 7px',
  borderRadius: 4,
  fontFamily: 'monospace',
};

export default MovieDetailPage;

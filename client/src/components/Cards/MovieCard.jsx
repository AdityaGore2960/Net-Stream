import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaStar } from 'react-icons/fa';
import { getImageURL, formatRating } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useUIStore } from '../../store/uiStore';

/**
 * Netflix-style Movie Card with premium inline hover overlay
 */
const MovieCard = ({ item, mediaType = 'movie', isLarge = false }) => {
  const [hovered, setHovered] = useState(false);
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { openDetail } = useUIStore();

  if (!item) return null;

  const inList   = isInWatchlist(item.id);
  const title    = item.title || item.name;
  const year     = (item.release_date || item.first_air_date)?.slice(0, 4);
  const rating   = formatRating(item.vote_average);

  /* always use poster for isLarge, backdrop fallback to poster otherwise */
  const imgPath  = isLarge
    ? (item.poster_path || item.backdrop_path)
    : (item.poster_path || item.backdrop_path);
  const imgUrl   = getImageURL(imgPath, 'w500');

  const handleClick = () => openDetail(item, mediaType);

  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inList) removeFromWatchlist(item.id, mediaType);
    else        addToWatchlist(item, mediaType);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        position:      'relative',
        flexShrink:    0,
        borderRadius:  '6px',
        overflow:      'hidden',
        cursor:        'pointer',
        aspectRatio:   '2 / 3',
        width:         '100%',
        background:    '#1a1a1a',
        transform:     hovered ? 'scale(1.15)' : 'scale(1)',
        zIndex:        hovered ? 20 : 1,
        boxShadow:     hovered
          ? '0 20px 40px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.06)'
          : '0 4px 12px rgba(0,0,0,0.4)',
        transition:    'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.3s cubic-bezier(0.25,0.46,0.45,0.94), z-index 0s',
      }}
    >
      {/* ── Poster image ── */}
      {imgPath ? (
        <img
          src={imgUrl}
          alt={title}
          loading="lazy"
          style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        />
      ) : (
        /* Fallback when no image */
        <div style={{
          width: '100%', height: '100%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px', background: '#222',
        }}>
          <span style={{ color: '#a3a3a3', fontSize: '0.8rem', textAlign: 'center', fontWeight: 500 }}>
            {title}
          </span>
        </div>
      )}

      {/* ── Hover overlay ── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
          opacity:    hovered ? 1 : 0,
          transition: 'opacity 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
          display:    'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding:    '12px',
        }}
      >
        {/* Play button — centered in upper area */}
        <div
          style={{
            position:   'absolute',
            top:        '50%',
            left:       '50%',
            transform:  hovered ? 'translate(-50%, -60%) scale(1)' : 'translate(-50%, -60%) scale(0.6)',
            transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94) 0.05s, opacity 0.3s ease',
            opacity:    hovered ? 1 : 0,
          }}
        >
          <div
            style={{
              width:          '44px',
              height:         '44px',
              borderRadius:   '50%',
              background:     '#ffffff',
              display:        'flex',
              alignItems:     'center',
              justifyContent: 'center',
              boxShadow:      '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <FaPlay
              style={{ color: '#000', fontSize: '0.9rem', marginLeft: '3px' }}
              onClick={(e) => { e.stopPropagation(); navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`); }}
            />
          </div>
        </div>

        {/* Bottom info */}
        <div
          style={{
            transform:  hovered ? 'translateY(0)' : 'translateY(10px)',
            opacity:    hovered ? 1 : 0,
            transition: 'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94) 0.06s, opacity 0.3s ease 0.06s',
          }}
        >
          {/* Title */}
          <p style={{
            color:        '#ffffff',
            fontWeight:   700,
            fontSize:     '0.85rem',
            lineHeight:   1.3,
            margin:       '0 0 5px',
            overflow:     'hidden',
            display:      '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}>
            {title}
          </p>

          {/* Star + Year */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
              <FaStar style={{ color: '#fbbf24', fontSize: '0.65rem' }} />
              <span style={{ color: '#fbbf24', fontSize: '0.72rem', fontWeight: 700 }}>{rating}</span>
            </div>
            {year && <span style={{ color: '#a3a3a3', fontSize: '0.72rem' }}>{year}</span>}
          </div>

          {/* Action icons */}
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
            {/* + List */}
            <button
              onClick={handleWatchlist}
              title={inList ? 'Remove from My List' : 'Add to My List'}
              style={iconCircleStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
            >
              {inList
                ? <FaCheck style={{ color: '#4ade80', fontSize: '0.65rem' }} />
                : <FaPlus  style={{ color: '#fff',    fontSize: '0.65rem' }} />
              }
            </button>

            {/* 👍 Like */}
            <button
              onClick={e => e.stopPropagation()}
              title="Like"
              style={iconCircleStyle}
              onMouseEnter={e => { e.currentTarget.style.borderColor = '#fff'; e.currentTarget.style.background = 'rgba(255,255,255,0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.5)'; e.currentTarget.style.background = 'rgba(0,0,0,0.4)'; }}
            >
              <FaThumbsUp style={{ color: '#fff', fontSize: '0.6rem' }} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconCircleStyle = {
  width:          '26px',
  height:         '26px',
  borderRadius:   '50%',
  background:     'rgba(0,0,0,0.4)',
  border:         '1px solid rgba(255,255,255,0.5)',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  cursor:         'pointer',
  transition:     'all 0.2s ease',
  padding:        0,
  flexShrink:     0,
};

export default MovieCard;

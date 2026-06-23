import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaPlay, FaPlus, FaCheck, FaThumbsUp, FaChevronDown } from 'react-icons/fa';
import { getImageURL, formatRating } from '../../services/tmdb';
import { useWatchlist } from '../../hooks/useWatchlist';
import { useUIStore } from '../../store/uiStore';

const MATCH_COLORS = [
  '#4ade80', '#22d3ee', '#f59e0b', '#a78bfa', '#f472b6',
];

function fakeMatch(id) {
  // Deterministic "match %" from the item id so it doesn't flicker
  return 67 + (id % 30);
}

/**
 * Netflix-style Movie Card — premium inline hover overlay
 */
const MovieCard = ({ item, mediaType = 'movie', isLarge = false }) => {
  const [hovered,     setHovered]     = useState(false);
  const [imgLoaded,   setImgLoaded]   = useState(false);
  const navigate = useNavigate();
  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const { openDetail } = useUIStore();

  if (!item) return null;

  const inList = isInWatchlist(item.id);
  const title  = item.title || item.name;
  const year   = (item.release_date || item.first_air_date)?.slice(0, 4);
  const rating = formatRating(item.vote_average);
  const match  = fakeMatch(item.id);
  const matchColor = MATCH_COLORS[item.id % MATCH_COLORS.length];

  const imgPath = item.poster_path || item.backdrop_path;
  const imgUrl  = getImageURL(imgPath, 'w300');

  const handleClick     = () => openDetail(item, mediaType);
  const handleWatchlist = (e) => {
    e.stopPropagation();
    if (inList) removeFromWatchlist(item.id, mediaType);
    else        addToWatchlist(item, mediaType);
  };
  const handlePlay = (e) => {
    e.stopPropagation();
    navigate(`/${mediaType === 'tv' ? 'tv' : 'movie'}/${item.id}`);
  };
  const handleMoreInfo = (e) => {
    e.stopPropagation();
    openDetail(item, mediaType);
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handleClick}
      style={{
        position:     'relative',
        borderRadius: '4px',
        overflow:     'visible',
        cursor:       'pointer',
        aspectRatio:  '2 / 3',
        width:        '100%',
      }}
    >
      {/* ── Card inner (scales on hover) ──────────────── */}
      <div
        style={{
          position:   'absolute',
          inset:      0,
          borderRadius: '4px',
          overflow:   'hidden',
          background: '#1a1a1a',
          transform:  hovered ? 'scale(1.07)' : 'scale(1)',
          zIndex:     hovered ? 20 : 1,
          boxShadow:  hovered
            ? '0 14px 50px rgba(0,0,0,0.85), 0 0 0 1px rgba(255,255,255,0.07)'
            : '0 4px 16px rgba(0,0,0,0.5)',
          transition: 'transform 0.32s cubic-bezier(0.25,0.46,0.45,0.94), box-shadow 0.32s cubic-bezier(0.25,0.46,0.45,0.94)',
        }}
      >
        {/* Poster */}
        {imgPath ? (
          <img
            src={imgUrl}
            alt={title}
            loading="lazy"
            onLoad={() => setImgLoaded(true)}
            style={{
              width:      '100%',
              height:     '100%',
              objectFit:  'cover',
              display:    'block',
              opacity:    imgLoaded ? 1 : 0,
              transition: 'opacity 0.4s ease',
            }}
          />
        ) : (
          <div
            style={{
              width: '100%', height: '100%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
              padding: '16px',
            }}
          >
            <span
              style={{
                color: '#a3a3a3', fontSize: '0.8rem',
                textAlign: 'center', fontWeight: 600,
              }}
            >
              {title}
            </span>
          </div>
        )}

        {/* ── Hover overlay ─────────────────────────────── */}
        <div
          style={{
            position:       'absolute',
            inset:          0,
            background:     'linear-gradient(to top, rgba(0,0,0,0.96) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.1) 100%)',
            opacity:        hovered ? 1 : 0,
            transition:     'opacity 0.3s ease',
            display:        'flex',
            flexDirection:  'column',
            justifyContent: 'flex-end',
            padding:        '10px 10px 11px',
          }}
        >
          {/* Center play icon */}
          <div
            style={{
              position:        'absolute',
              top:             '42%',
              left:            '50%',
              transform:       hovered ? 'translate(-50%, -50%) scale(1)' : 'translate(-50%, -50%) scale(0.5)',
              opacity:         hovered ? 1 : 0,
              transition:      'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94) 0.04s, opacity 0.3s ease 0.04s',
            }}
          >
            <div
              onClick={handlePlay}
              style={{
                width:          46,
                height:         46,
                borderRadius:   '50%',
                background:     '#ffffff',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
                boxShadow:      '0 4px 20px rgba(0,0,0,0.6)',
              }}
            >
              <FaPlay style={{ color: '#000', fontSize: '0.95rem', marginLeft: '3px' }} />
            </div>
          </div>

          {/* Bottom info */}
          <div
            style={{
              transform:  hovered ? 'translateY(0)' : 'translateY(8px)',
              opacity:    hovered ? 1 : 0,
              transition: 'transform 0.3s ease 0.06s, opacity 0.3s ease 0.06s',
            }}
          >
            {/* Match % */}
            <div
              style={{
                fontSize:    '0.72rem',
                fontWeight:  700,
                color:       matchColor,
                marginBottom: 3,
              }}
            >
              {match}% Match
            </div>

            {/* Title */}
            <p
              style={{
                color:           '#fff',
                fontWeight:      700,
                fontSize:        '0.82rem',
                lineHeight:      1.25,
                margin:          '0 0 5px',
                overflow:        'hidden',
                display:         '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
              }}
            >
              {title}
            </p>

            {/* Meta row */}
            <div
              style={{
                display:      'flex',
                alignItems:   'center',
                gap:          6,
                marginBottom: 8,
                fontSize:     '0.68rem',
                color:        'rgba(255,255,255,0.65)',
              }}
            >
              <span style={{ color: '#fbbf24', fontWeight: 700 }}>★ {rating}</span>
              {year && <span>• {year}</span>}
            </div>

            {/* Action icons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <button onClick={handleWatchlist} title={inList ? 'Remove from My List' : 'Add to My List'} style={iconBtn}>
                {inList
                  ? <FaCheck     style={{ color: '#4ade80', fontSize: '0.62rem' }} />
                  : <FaPlus      style={{ color: '#fff',    fontSize: '0.62rem' }} />
                }
              </button>
              <button onClick={(e) => e.stopPropagation()} title="Like" style={iconBtn}>
                <FaThumbsUp style={{ color: '#fff', fontSize: '0.58rem' }} />
              </button>
              {/* More info */}
              <button
                onClick={handleMoreInfo}
                title="More Info"
                style={{ ...iconBtn, marginLeft: 'auto' }}
              >
                <FaChevronDown style={{ color: '#fff', fontSize: '0.62rem' }} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const iconBtn = {
  width:          28,
  height:         28,
  borderRadius:   '50%',
  background:     'rgba(20,20,20,0.6)',
  border:         '1.5px solid rgba(255,255,255,0.45)',
  display:        'flex',
  alignItems:     'center',
  justifyContent: 'center',
  cursor:         'pointer',
  transition:     'border-color 0.18s ease, background 0.18s ease',
  padding:        0,
  flexShrink:     0,
};

export default MovieCard;

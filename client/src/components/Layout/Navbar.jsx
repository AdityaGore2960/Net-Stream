import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  FaSearch, FaBell, FaBars, FaTimes, FaCaretDown,
  FaChevronDown,
} from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const GENRES = [
  { label: 'Action',      path: '/movies' },
  { label: 'Comedy',      path: '/movies' },
  { label: 'Drama',       path: '/movies' },
  { label: 'Horror',      path: '/movies' },
  { label: 'Sci-Fi',      path: '/movies' },
  { label: 'Romance',     path: '/movies' },
  { label: 'Thriller',    path: '/movies' },
  { label: 'Animation',   path: '/movies' },
];

const Navbar = () => {
  const [isScrolled,      setIsScrolled]      = useState(false);
  const [isMobileOpen,    setIsMobileOpen]    = useState(false);
  const [browseFocus,     setBrowseFocus]     = useState(false);
  const [searchOpen,      setSearchOpen]      = useState(false);
  const [searchValue,     setSearchValue]     = useState('');
  const searchRef = useRef(null);

  const { user, logout } = useAuthStore();
  const { toggleSearch } = useUIStore();
  const location         = useLocation();
  const navigate         = useNavigate();

  /* scroll detection */
  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  /* focus search input when opened */
  useEffect(() => {
    if (searchOpen && searchRef.current) searchRef.current.focus();
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchValue.trim())}`);
      setSearchValue('');
      setSearchOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Home',     path: '/' },
    { name: 'Movies',   path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'My List',  path: '/my-list' },
  ];

  return (
    <>
      <nav
        style={{
          position:    'fixed',
          top:         0,
          width:       '100%',
          zIndex:      999,
          transition:  'background 0.4s ease, box-shadow 0.4s ease',
          background:  isScrolled
            ? 'rgba(10,10,10,0.97)'
            : 'linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 100%)',
          boxShadow:   isScrolled ? '0 1px 0 rgba(255,255,255,0.06)' : 'none',
          backdropFilter: isScrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div
          style={{
            maxWidth:       '100%',
            padding:        '0 4%',
            height:         68,
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'space-between',
            gap:            32,
          }}
        >
          {/* ── Left: Logo + Nav links ──────────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 28, flexShrink: 0 }}>
            {/* Logo */}
            <Link
              to="/"
              style={{
                color:       '#e50914',
                fontSize:    'clamp(1.4rem, 2.5vw, 1.9rem)',
                fontWeight:  900,
                letterSpacing: '0.04em',
                fontFamily:  'Georgia, serif',
                textDecoration: 'none',
                lineHeight:  1,
                textShadow:  '0 0 30px rgba(229,9,20,0.4)',
                flexShrink:  0,
              }}
            >
              NETSTREAM
            </Link>

            {/* Desktop nav links */}
            <ul
              style={{
                display:    'flex',
                alignItems: 'center',
                gap:        4,
                margin:     0,
                padding:    0,
                listStyle:  'none',
              }}
              className="ns-nav-links"
            >
              {navLinks.map((link) => {
                const active = location.pathname === link.path;
                return (
                  <li key={link.name}>
                    <Link
                      to={link.path}
                      style={{
                        color:         active ? '#ffffff' : 'rgba(255,255,255,0.75)',
                        fontSize:      '0.84rem',
                        fontWeight:    active ? 700 : 500,
                        textDecoration:'none',
                        padding:       '6px 10px',
                        borderRadius:  4,
                        transition:    'color 0.2s ease',
                        whiteSpace:    'nowrap',
                        position:      'relative',
                      }}
                      onMouseEnter={e => { if (!active) e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.75)'; }}
                    >
                      {link.name}
                      {active && (
                        <span
                          style={{
                            position:   'absolute',
                            bottom:     0,
                            left:       '50%',
                            transform:  'translateX(-50%)',
                            width:      4,
                            height:     4,
                            borderRadius: '50%',
                            background: '#e50914',
                          }}
                        />
                      )}
                    </Link>
                  </li>
                );
              })}

              {/* Browse by genre dropdown */}
              <li
                style={{ position: 'relative' }}
                onMouseEnter={() => setBrowseFocus(true)}
                onMouseLeave={() => setBrowseFocus(false)}
              >
                <button
                  style={{
                    display:     'flex',
                    alignItems:  'center',
                    gap:         5,
                    color:       browseFocus ? '#fff' : 'rgba(255,255,255,0.75)',
                    fontSize:    '0.84rem',
                    fontWeight:  500,
                    background:  'none',
                    border:      'none',
                    cursor:      'pointer',
                    padding:     '6px 10px',
                    borderRadius: 4,
                    transition:  'color 0.2s ease',
                    whiteSpace:  'nowrap',
                  }}
                >
                  Browse
                  <FaChevronDown
                    style={{
                      fontSize:   '0.6rem',
                      transform:  browseFocus ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease',
                    }}
                  />
                </button>

                {/* Genre dropdown */}
                <div
                  style={{
                    position:   'absolute',
                    top:        '100%',
                    left:       '50%',
                    transform:  'translateX(-50%)',
                    marginTop:  8,
                    width:      220,
                    background: 'rgba(20,20,20,0.97)',
                    border:     '1px solid rgba(255,255,255,0.08)',
                    borderRadius: 6,
                    boxShadow:  '0 20px 60px rgba(0,0,0,0.8)',
                    backdropFilter: 'blur(16px)',
                    opacity:    browseFocus ? 1 : 0,
                    pointerEvents: browseFocus ? 'auto' : 'none',
                    transform:  browseFocus ? 'translateX(-50%) translateY(0)' : 'translateX(-50%) translateY(-8px)',
                    transition: 'opacity 0.2s ease, transform 0.2s ease',
                    overflow:   'hidden',
                    zIndex:     100,
                  }}
                >
                  {/* Triangle arrow */}
                  <div
                    style={{
                      position:    'absolute',
                      top:         -6,
                      left:        '50%',
                      transform:   'translateX(-50%)',
                      width:       0,
                      height:      0,
                      borderLeft:  '6px solid transparent',
                      borderRight: '6px solid transparent',
                      borderBottom: '6px solid rgba(255,255,255,0.08)',
                    }}
                  />
                  <p
                    style={{
                      fontSize:   '0.68rem',
                      fontWeight: 700,
                      color:      'rgba(255,255,255,0.35)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding:    '12px 16px 6px',
                      margin:     0,
                    }}
                  >
                    Genres
                  </p>
                  <ul style={{ margin: 0, padding: '0 0 8px', listStyle: 'none' }}>
                    {GENRES.map((g) => (
                      <li key={g.label}>
                        <Link
                          to={g.path}
                          style={{
                            display:     'block',
                            padding:     '9px 16px',
                            fontSize:    '0.85rem',
                            color:       'rgba(255,255,255,0.8)',
                            textDecoration: 'none',
                            transition:  'background 0.15s ease, color 0.15s ease',
                          }}
                          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.12)'; e.currentTarget.style.color = '#fff'; }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.8)'; }}
                        >
                          {g.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            </ul>
          </div>

          {/* ── Right: Search + Notif + User ────────────────── */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>

            {/* Expanding search */}
            <form onSubmit={handleSearchSubmit} style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            8,
                  background:     searchOpen ? 'rgba(0,0,0,0.6)' : 'transparent',
                  border:         searchOpen ? '1px solid rgba(255,255,255,0.5)' : '1px solid transparent',
                  borderRadius:   4,
                  padding:        searchOpen ? '5px 10px' : '5px',
                  transition:     'all 0.3s ease',
                  backdropFilter: searchOpen ? 'blur(8px)' : 'none',
                }}
              >
                <button
                  type="button"
                  onClick={() => setSearchOpen((o) => !o)}
                  style={{
                    background: 'none',
                    border:     'none',
                    color:      '#fff',
                    cursor:     'pointer',
                    padding:    0,
                    display:    'flex',
                    alignItems: 'center',
                    flexShrink: 0,
                  }}
                  aria-label="Search"
                >
                  <FaSearch size={16} />
                </button>
                <input
                  ref={searchRef}
                  type="text"
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  placeholder="Titles, genres, people…"
                  style={{
                    background:  'none',
                    border:      'none',
                    outline:     'none',
                    color:       '#fff',
                    fontSize:    '0.85rem',
                    width:       searchOpen ? 180 : 0,
                    opacity:     searchOpen ? 1 : 0,
                    transition:  'width 0.3s ease, opacity 0.3s ease',
                    whiteSpace:  'nowrap',
                  }}
                />
              </div>
            </form>

            {/* Notifications */}
            <button
              style={{
                background: 'none',
                border:     'none',
                color:      'rgba(255,255,255,0.85)',
                cursor:     'pointer',
                padding:    0,
                display:    'flex',
                position:   'relative',
              }}
              className="ns-nav-notif"
              aria-label="Notifications"
            >
              <FaBell size={18} />
              <span
                style={{
                  position:   'absolute',
                  top:        -2,
                  right:      -2,
                  width:      8,
                  height:     8,
                  borderRadius: '50%',
                  background: '#e50914',
                  border:     '1.5px solid #0a0a0a',
                }}
              />
            </button>

            {/* User avatar / Sign In */}
            {user ? (
              <div className="ns-nav-user" style={{ position: 'relative' }}>
                <div
                  style={{
                    display:    'flex',
                    alignItems: 'center',
                    gap:        6,
                    cursor:     'pointer',
                  }}
                >
                  <div
                    style={{
                      width:        34,
                      height:       34,
                      borderRadius: 4,
                      overflow:     'hidden',
                      border:       '2px solid transparent',
                      transition:   'border-color 0.2s ease',
                    }}
                    className="ns-avatar"
                  >
                    <img
                      src={user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                      alt="avatar"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                  <FaCaretDown
                    style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.7rem' }}
                    className="ns-caret"
                  />
                </div>

                {/* Dropdown */}
                <div className="ns-user-dropdown">
                  <div
                    style={{
                      padding:      '14px 16px',
                      borderBottom: '1px solid rgba(255,255,255,0.08)',
                    }}
                  >
                    <p style={{ color: '#fff', fontWeight: 600, margin: 0, fontSize: '0.9rem' }}>
                      {user.username}
                    </p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', margin: '2px 0 0', fontSize: '0.75rem' }}>
                      Member
                    </p>
                  </div>
                  {[
                    { label: 'Profile',   action: null },
                    { label: 'Watchlist', action: () => navigate('/my-list') },
                    { label: 'Settings',  action: null },
                  ].map((item) => (
                    <button
                      key={item.label}
                      onClick={item.action || undefined}
                      style={ddItemStyle}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(229,9,20,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      {item.label}
                    </button>
                  ))}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 4 }}>
                    <button
                      onClick={handleLogout}
                      style={{ ...ddItemStyle, color: 'rgba(255,255,255,0.5)' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(229,9,20,0.1)'; e.currentTarget.style.color = '#fff'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                    >
                      Sign Out of NetStream
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                style={{
                  background:   '#e50914',
                  color:        '#fff',
                  padding:      '7px 18px',
                  borderRadius: 4,
                  fontWeight:   600,
                  fontSize:     '0.85rem',
                  textDecoration: 'none',
                  transition:   'background 0.2s ease',
                  whiteSpace:   'nowrap',
                }}
                onMouseEnter={e => e.currentTarget.style.background = '#f40612'}
                onMouseLeave={e => e.currentTarget.style.background = '#e50914'}
                className="ns-nav-signin"
              >
                Sign In
              </Link>
            )}

            {/* Mobile hamburger */}
            <button
              onClick={() => setIsMobileOpen((o) => !o)}
              style={{
                background: 'none', border: 'none', color: '#fff', cursor: 'pointer', padding: 4,
              }}
              className="ns-nav-hamburger"
              aria-label="Menu"
            >
              {isMobileOpen ? <FaTimes size={22} /> : <FaBars size={22} />}
            </button>
          </div>
        </div>
      </nav>

      {/* ── Mobile drawer ────────────────────────────────────── */}
      {isMobileOpen && (
        <div
          style={{
            position:   'fixed',
            inset:      0,
            top:        68,
            background: 'rgba(0,0,0,0.85)',
            zIndex:     998,
            backdropFilter: 'blur(4px)',
          }}
          onClick={() => setIsMobileOpen(false)}
        />
      )}
      <div
        style={{
          position:    'fixed',
          top:         68,
          right:       0,
          bottom:      0,
          width:       280,
          background:  'rgba(14,14,14,0.98)',
          borderLeft:  '1px solid rgba(255,255,255,0.05)',
          zIndex:      999,
          transform:   isMobileOpen ? 'translateX(0)' : 'translateX(100%)',
          transition:  'transform 0.3s cubic-bezier(0.25,0.46,0.45,0.94)',
          overflowY:   'auto',
        }}
      >
        {user && (
          <div
            style={{
              display:      'flex',
              alignItems:   'center',
              gap:          12,
              padding:      '20px 20px 16px',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
            }}
          >
            <img
              src={user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
              alt="avatar"
              style={{ width: 44, height: 44, borderRadius: 4 }}
            />
            <div>
              <p style={{ color: '#fff', fontWeight: 600, margin: 0 }}>{user.username}</p>
              <button
                onClick={handleLogout}
                style={{
                  background: 'none', border: 'none', color: '#e50914',
                  cursor: 'pointer', padding: 0, fontSize: '0.8rem', fontWeight: 600,
                }}
              >
                Sign Out
              </button>
            </div>
          </div>
        )}

        <ul style={{ margin: 0, padding: '12px 0', listStyle: 'none' }}>
          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                onClick={() => setIsMobileOpen(false)}
                style={{
                  display:     'block',
                  padding:     '13px 20px',
                  color:       location.pathname === link.path ? '#fff' : 'rgba(255,255,255,0.7)',
                  fontWeight:  location.pathname === link.path ? 700 : 400,
                  textDecoration: 'none',
                  fontSize:    '1rem',
                  borderLeft:  location.pathname === link.path ? '3px solid #e50914' : '3px solid transparent',
                  transition:  'all 0.15s ease',
                }}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {!user && (
          <div style={{ padding: '16px 20px' }}>
            <Link
              to="/login"
              onClick={() => setIsMobileOpen(false)}
              style={{
                display:     'block',
                textAlign:   'center',
                background:  '#e50914',
                color:       '#fff',
                padding:     '12px',
                borderRadius: 4,
                fontWeight:  700,
                textDecoration: 'none',
              }}
            >
              Sign In
            </Link>
          </div>
        )}
      </div>

      {/* ── Scoped styles ────────────────────────────────────── */}
      <style>{`
        /* Hide hamburger on md+ */
        .ns-nav-hamburger { display: none !important; }
        @media (max-width: 768px) {
          .ns-nav-hamburger { display: flex !important; }
          .ns-nav-links { display: none !important; }
          .ns-nav-notif { display: none !important; }
          .ns-nav-signin { display: none !important; }
          .ns-nav-user { display: none !important; }
        }

        /* User dropdown hover reveal */
        .ns-nav-user .ns-user-dropdown {
          position: absolute;
          top: calc(100% + 10px);
          right: 0;
          width: 220px;
          background: rgba(20,20,20,0.97);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 6px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.8);
          backdrop-filter: blur(16px);
          opacity: 0;
          pointer-events: none;
          transform: translateY(-8px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          overflow: hidden;
          z-index: 200;
        }
        .ns-nav-user:hover .ns-user-dropdown {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .ns-nav-user:hover .ns-caret {
          transform: rotate(180deg);
          transition: transform 0.25s ease;
        }
        .ns-nav-user:hover .ns-avatar {
          border-color: rgba(255,255,255,0.5) !important;
        }
      `}</style>
    </>
  );
};

const ddItemStyle = {
  display:   'block',
  width:     '100%',
  textAlign: 'left',
  padding:   '10px 16px',
  background: 'transparent',
  border:    'none',
  color:     'rgba(255,255,255,0.8)',
  fontSize:  '0.85rem',
  cursor:    'pointer',
  transition:'background 0.15s ease, color 0.15s ease',
};

export default Navbar;

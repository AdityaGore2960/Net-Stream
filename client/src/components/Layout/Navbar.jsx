import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaSearch, FaBell, FaBars, FaTimes, FaCaretDown } from 'react-icons/fa';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

/**
 * Main Navigation Bar
 */
const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout } = useAuthStore();
  const { toggleSearch } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Movies', path: '/movies' },
    { name: 'TV Shows', path: '/tv' },
    { name: 'My List', path: '/my-list' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-colors duration-300 ${isScrolled ? 'bg-[#0a0a0a]' : 'bg-gradient-to-b from-black/80 to-transparent'
        }`}
    >
      <div className="container mx-auto px-4 md:px-8 py-4 flex items-center justify-between">

        {/* Left Side (Logo + Desktop Links) */}
        <div className="flex items-center gap-8">
          <Link to="/" className="text-ns-red text-2xl md:text-3xl font-bold tracking-wider" style={{ fontFamily: 'Georgia, serif' }}>
            NETSTREAM
          </Link>

          <ul className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <li key={link.name}>
                <Link
                  to={link.path}
                  className={`text-sm transition-colors hover:text-white ${location.pathname === link.path ? 'text-white font-medium' : 'text-ns-gray-1'
                    }`}
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Right Side (Search + User) */}
        <div className="flex items-center gap-4 md:gap-6">
          <button
            onClick={toggleSearch}
            className="text-white hover:text-ns-gray-1 transition-colors"
            aria-label="Search"
          >
            <FaSearch size={20} />
          </button>

          <div className="hidden md:block text-white">
            <FaBell size={20} className="hover:text-ns-gray-1 cursor-pointer transition-colors" />
          </div>

          {user ? (
            <div className="relative group cursor-pointer hidden md:flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-ns-gray-2 overflow-hidden">
                <img
                  src={user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                  alt="User avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <FaCaretDown className="text-white transition-transform group-hover:rotate-180" />

              {/* Dropdown */}
              <div className="absolute top-full right-0 mt-2 w-48 bg-ns-dark border border-ns-gray-3 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4 border-b border-ns-gray-3">
                  <p className="text-white font-medium truncate">{user.username}</p>
                </div>
                <ul className="py-2">
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-ns-gray-1 hover:text-white hover:bg-ns-dark-3 transition-colors">
                      Profile
                    </button>
                  </li>
                  <li>
                    <button className="w-full text-left px-4 py-2 text-sm text-ns-gray-1 hover:text-white hover:bg-ns-dark-3 transition-colors">
                      Settings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-ns-gray-1 hover:text-white hover:bg-ns-dark-3 transition-colors"
                    >
                      Sign Out
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          ) : (
            <Link to="/login" className="hidden md:block bg-ns-red text-white px-4 py-1 rounded hover:bg-ns-red-hover transition-colors">
              Sign In
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 top-[72px] bg-black/80 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={`md:hidden fixed top-[72px] bottom-0 left-0 w-64 bg-ns-black border-r border-white/5 z-50 transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <ul className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
          {user && (
            <li className="flex items-center gap-4 mb-4 border-b border-ns-gray-3 pb-6">
              <img
                src={user.avatar || 'https://upload.wikimedia.org/wikipedia/commons/0/0b/Netflix-avatar.png'}
                alt="Avatar"
                className="w-12 h-12 rounded"
              />
              <div>
                <p className="text-white font-medium">{user.username}</p>
                <button onClick={handleLogout} className="text-ns-gray-1 text-sm mt-1 hover:text-white">Sign Out</button>
              </div>
            </li>
          )}

          {navLinks.map((link) => (
            <li key={link.name}>
              <Link
                to={link.path}
                className={`text-xl block ${location.pathname === link.path ? 'text-white font-bold' : 'text-ns-gray-1'}`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            </li>
          ))}

          {!user && (
            <li className="mt-auto pt-4 border-t border-white/10">
              <Link
                to="/login"
                className="block text-center w-full bg-ns-red text-white py-3 rounded text-lg font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;

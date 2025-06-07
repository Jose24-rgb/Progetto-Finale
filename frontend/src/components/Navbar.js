import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState, useEffect } from 'react';
import UserMenu from '../components/UserMenu';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();

  const isHomePage = location.pathname === '/';
  const isCartPage = location.pathname === '/cart';

  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNavbar = () => setNavbarCollapsed(!navbarCollapsed);
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || null;

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    navigate(`/?search=${encodeURIComponent(value)}`);
  };

  useEffect(() => {
    const current = searchParams.get('search') || '';
    setSearchQuery(current);
  }, [searchParams]);

  const isMobile = window.innerWidth < 768;
  const hideActions = isMobile && searchQuery.trim().length > 0;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3" role="navigation" aria-label="Main navigation">
      <Link className="navbar-brand" to="/">🎮 GameDev Shop</Link>

      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
        aria-label="Apri menu di navigazione"
        aria-controls="main-navbar"
        aria-expanded={!navbarCollapsed}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${!navbarCollapsed ? 'show' : ''}`} id="main-navbar">
        <ul className="navbar-nav ms-auto d-flex align-items-center d-none d-lg-flex gap-3">
          {isHomePage && (
            <li className="nav-item">
              <input
                type="text"
                className="form-control form-control-sm"
                placeholder="🔍 Cerca gioco..."
                value={searchQuery}
                onChange={handleSearchChange}
                style={{ minWidth: '180px' }}
              />
            </li>
          )}
          <li className="nav-item">
            <Link
              to="/cart"
              className="text-white text-decoration-none"
              style={{ fontSize: '1.5rem' }}
              aria-label="Vai al carrello"
            >
              🛒
            </Link>
          </li>
          <li className="nav-item">
            <UserMenu
              avatarLetter={avatarLetter}
              menuOpen={desktopMenuOpen}
              setMenuOpen={setDesktopMenuOpen}
              user={user}
              handleLogout={handleLogout}
              id="desktop-user-menu"
              ariaLabel="Menu utente desktop"
            />
          </li>
        </ul>

        <div className="d-flex d-lg-none flex-row align-items-center gap-2 mt-3 w-100 justify-content-end">
          {isHomePage && (
            <input
              type="text"
              className="form-control form-control-sm flex-grow-1"
              placeholder="🔍 Cerca gioco..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          )}
          {!hideActions && (
            <>
              {!isCartPage && (
                <Link
                  to="/cart"
                  className="text-white text-decoration-none"
                  style={{ fontSize: '1.5rem' }}
                  aria-label="Vai al carrello"
                >
                  🛒
                </Link>
              )}
              <UserMenu
                avatarLetter={avatarLetter}
                menuOpen={mobileMenuOpen}
                setMenuOpen={setMobileMenuOpen}
                user={user}
                handleLogout={handleLogout}
                id="mobile-user-menu"
                ariaLabel="Menu utente mobile"
              />
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;





















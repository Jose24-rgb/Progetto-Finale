import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import UserMenu from '../components/UserMenu';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [desktopMenuOpen, setDesktopMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleNavbar = () => setNavbarCollapsed(!navbarCollapsed);
  const avatarLetter = user?.username?.charAt(0).toUpperCase() || null;

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark px-3"
      role="navigation"
      aria-label="Main navigation"
    >
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

      <div
        className={`collapse navbar-collapse ${!navbarCollapsed ? 'show' : ''}`}
        id="main-navbar"
      >
        {/* Desktop navbar */}
        <ul className="navbar-nav ms-auto d-flex align-items-center d-none d-lg-flex">
          <li className="nav-item me-3">
            <Link to="/cart" className="text-white text-decoration-none" style={{ fontSize: '1.5rem' }} aria-label="Vai al carrello">🛒</Link>
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

        {/* Mobile navbar */}
        <div className="d-flex d-lg-none justify-content-end align-items-center gap-3 mt-3 w-100">
          <Link to="/cart" className="text-white text-decoration-none" style={{ fontSize: '1.5rem' }} aria-label="Vai al carrello">🛒</Link>

          <UserMenu
            avatarLetter={avatarLetter}
            menuOpen={mobileMenuOpen}
            setMenuOpen={setMobileMenuOpen}
            user={user}
            handleLogout={handleLogout}
            id="mobile-user-menu"
            ariaLabel="Menu utente mobile"
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;















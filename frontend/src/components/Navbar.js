import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);
  const toggleNavbar = () => setNavbarCollapsed(!navbarCollapsed);

  const avatarLetter = user?.username?.charAt(0).toUpperCase() || null;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">🎮 GameDev Shop</Link>

      {/* Bottone hamburger */}
      <button
        className="navbar-toggler"
        type="button"
        onClick={toggleNavbar}
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className={`collapse navbar-collapse ${!navbarCollapsed ? 'show' : ''}`}>
        <ul className="navbar-nav ms-auto d-flex align-items-center d-none d-lg-flex">

          {/* Carrello - solo desktop */}
          <li className="nav-item me-3">
            <Link to="/cart" className="text-white text-decoration-none">
              <div className="d-flex justify-content-center align-items-center" style={{ fontSize: '1.5rem' }}>
                🛒
              </div>
            </Link>
          </li>

          {/* Avatar/Guest - solo desktop */}
          <li className="nav-item position-relative">
            <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              {avatarLetter ? (
                <div
                  className="border border-dark d-flex justify-content-center align-items-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {avatarLetter}
                </div>
              ) : (
                <img
                  src="/icone/User Icona.png"
                  alt="Guest"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>

            {menuOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                style={{ zIndex: 1000 }}
              >
                <ul className="list-unstyled m-0 p-2 text-dark">
                  {!user ? (
                    <>
                      <li><Link to="/login" className="dropdown-item">🔑 Login</Link></li>
                      <li><Link to="/register" className="dropdown-item">📝 Register</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/orders" className="dropdown-item">📦 Ordini</Link></li>
                      <li><Link to="#" className="dropdown-item">💼 Abbonamento</Link></li>
                      <li><Link to="#" className="dropdown-item">⚙️ Config</Link></li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item text-danger"
                        >
                          🚪 Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </li>
        </ul>

        {/* Carrello + Avatar solo su mobile */}
        <div className="d-flex d-lg-none justify-content-end align-items-center gap-3 mt-3">
          {/* Carrello */}
          <Link to="/cart" className="text-white text-decoration-none">
            <div style={{ fontSize: '1.5rem' }}>🛒</div>
          </Link>

          {/* Avatar/Guest */}
          <div className="position-relative">
            <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              {avatarLetter ? (
                <div
                  className="border border-dark d-flex justify-content-center align-items-center"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {avatarLetter}
                </div>
              ) : (
                <img
                  src="/icone/User Icona.png"
                  alt="Guest"
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '50%',
                    objectFit: 'cover'
                  }}
                />
              )}
            </div>

            {menuOpen && (
              <div
                className="position-absolute end-0 mt-2 bg-white border rounded shadow-sm"
                style={{ zIndex: 1000 }}
              >
                <ul className="list-unstyled m-0 p-2 text-dark">
                  {!user ? (
                    <>
                      <li><Link to="/login" className="dropdown-item">🔑 Login</Link></li>
                      <li><Link to="/register" className="dropdown-item">📝 Register</Link></li>
                    </>
                  ) : (
                    <>
                      <li><Link to="/orders" className="dropdown-item">📦 Ordini</Link></li>
                      <li><Link to="#" className="dropdown-item">💼 Abbonamento</Link></li>
                      <li><Link to="#" className="dropdown-item">⚙️ Config</Link></li>
                      <li>
                        <button
                          onClick={handleLogout}
                          className="dropdown-item text-danger"
                        >
                          🚪 Logout
                        </button>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;












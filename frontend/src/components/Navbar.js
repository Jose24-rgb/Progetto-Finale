// Navbar.js
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(prev => !prev);

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">🎮 GameDev Shop</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto d-flex align-items-center">
          <li className="nav-item me-3">
            <Link className="nav-link" to="/cart">🛒 Carrello</Link>
          </li>
          <li className="nav-item position-relative">
            <div onClick={toggleMenu} style={{ cursor: 'pointer' }}>
              <img
                src="https://via.placeholder.com/40"
                alt="Profile"
                className="border border-light"
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
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
                      <li><button onClick={handleLogout} className="dropdown-item text-danger">🚪 Logout</button></li>
                    </>
                  )}
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;







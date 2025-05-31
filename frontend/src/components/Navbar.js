import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-4">
      <Link className="navbar-brand" to="/">🎮 GameDev Shop</Link>
      <div className="collapse navbar-collapse">
        <ul className="navbar-nav ms-auto">
          <li className="nav-item">
            <Link className="nav-link" to="/cart">🛒 Carrello</Link>
          </li>

          {user ? (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/orders">📦 Ordini</Link>
              </li>
              <li className="nav-item">
              <span className="nav-link">👋 {user?.username || 'Utente'}</span>
              </li>
              <li className="nav-item">
                <button className="btn btn-outline-light ms-2" onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link className="nav-link" to="/login">Login</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/register">Register</Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;



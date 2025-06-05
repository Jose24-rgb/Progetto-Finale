import { useEffect, useState, useCallback } from 'react';
import axios from '../services/apis';
import { useCart } from '../context/CartContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import { useAuth } from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState(() => {
    const stored = localStorage.getItem('filters');
    return stored ? JSON.parse(stored) : {};
  });

  const { addToCart } = useCart();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const buildQuery = (obj) => {
    return Object.entries(obj)
      .filter(([_, value]) => value !== '' && value !== null && value !== false)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const query = buildQuery(filters);
        const res = await axios.get(`/games?${query}`);
        setGames(res.data);
      } catch (err) {
        console.error('Errore nel recupero giochi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [filters, location.key]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters));
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Sei sicuro di voler eliminare questo gioco?')) return;
    try {
      await axios.delete(`/games/${id}`);
      setGames(prev => prev.filter(g => g._id !== id));
    } catch (err) {
      alert('Errore durante l\'eliminazione');
    }
  };

  return (
    <div className="container mt-4 mb-5">
      <Filters onFilterChange={handleFilterChange} defaultFilters={filters} />

      {!loading && games.length > 0 && (
        <div className="row mb-3">
          <div className="col-sm-12 col-md-6 d-flex align-items-center mb-2 mb-md-0 results-admin-shift">
            <div className="fw-semibold me-3" style={{ fontSize: '1.1rem' }}>
              {games.length} {games.length === 1 ? 'risultato' : 'risultati'}
            </div>
            {user?.isAdmin && (
              <button className="btn btn-success btn-sm" onClick={() => navigate('/admin/create-game')}>
                ➕ Crea Gioco
              </button>
            )}
          </div>
        </div>
      )}

      {loading ? (
        <p>Caricamento giochi...</p>
      ) : games.length === 0 ? (
        <p className="text-muted">Nessun risultato trovato.</p>
      ) : (
        <div className="row gx-3">
          {games.map((game) => (
            <div className="col-12 col-sm-6 col-md-4 mb-4 d-flex justify-content-center" key={game._id}>
              <div className="card game-card p-2 border-0">
                {game.imageUrl && (
                  <img
                    src={game.imageUrl}
                    className="card-img-top img-fluid"
                    alt={game.title}
                  />
                )}
                <div className="d-flex flex-column mt-2">
                  <h5 className="card-title mb-2">
                    <Link to={`/games/${game._id}`} className="text-decoration-none">
                      {game.title}
                    </Link>
                  </h5>

                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-sm w-100" onClick={() => addToCart(game)}>
                      🛒 Aggiungi al carrello
                    </button>
                  </div>

                  {user?.isAdmin && (
                    <div className="d-flex flex-sm-row flex-column gap-2 mt-2">
                      <button
                        className="btn btn-warning btn-sm admin-btn w-50"
                        onClick={() => navigate(`/admin/edit-game/${game._id}`)}
                      >
                        ✏️ Modifica
                      </button>
                      <button
                        className="btn btn-danger btn-sm admin-btn w-50"
                        onClick={() => handleDelete(game._id)}
                      >
                        🗑️ Elimina
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;





















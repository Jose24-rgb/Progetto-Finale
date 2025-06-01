import { useEffect, useState } from 'react';
import axios from '../services/apis';
import { useCart } from '../context/CartContext';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import Filters from '../components/Filters';
import { useAuth } from '../context/AuthContext';

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
    const query = Object.entries(obj)
      .filter(([_, value]) => value !== '' && value !== null && value !== false)
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');
    return query ? `?${query}` : '';
  };

  useEffect(() => {
    const fetchGames = async () => {
      setLoading(true);
      try {
        const query = buildQuery(filters);
        const res = await axios.get(`/games${query}`);
        setGames(res.data);
      } catch (err) {
        console.error('Errore nel recupero giochi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [filters, location.key]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    localStorage.setItem('filters', JSON.stringify(newFilters));
  };

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
    <div className="container mt-4">
      <h2 className="mb-4">🎮 Giochi disponibili</h2>

      <Filters onFilterChange={handleFilterChange} defaultFilters={filters} />

      {loading ? (
        <p>Caricamento giochi...</p>
      ) : games.length === 0 ? (
        <p className="text-muted">Nessun risultato trovato.</p>
      ) : (
        <div className="row">
          {games.map((game) => {
            const finalPrice = game.discount > 0
              ? game.price * (1 - game.discount / 100)
              : game.price;

            return (
              <div className="col-md-4 mb-4" key={game._id}>
                <div className="card h-100">
                  <img
                    src={game.imageUrl}
                    className="card-img-top"
                    alt={game.title}
                  />
                  <div className="card-body">
                    <h5 className="card-title">
                      <Link to={`/games/${game._id}`} className="text-decoration-none">
                        {game.title}
                      </Link>
                    </h5>
                    <p className="card-text mb-1"><strong>🎮 Genere:</strong> {game.genre}</p>
                    <p className="card-text mb-1"><strong>🖥️ Sistema:</strong> {game.system || '—'}</p>
                    <p className="card-text mb-1"><strong>🛒 Piattaforma:</strong> {game.platform || '—'}</p>
                    <p className="card-text mb-1"><strong>📦 Tipo:</strong> {game.type || '—'}</p>
                    <p className="card-text mb-2"><strong>🔄 Stock:</strong> {game.stock}</p>

                    {game.discount > 0 ? (
                      <>
                        <p className="card-text text-muted text-decoration-line-through mb-1">
                          € {game.price.toFixed(2)}
                        </p>
                        <p className="card-text fw-bold text-success">
                          € {finalPrice.toFixed(2)} (-{game.discount}%)
                        </p>
                      </>
                    ) : (
                      <p className="card-text fw-bold">€ {game.price.toFixed(2)}</p>
                    )}

                    {user?.isAdmin && (
                      <div className="d-flex gap-2 mb-2">
                        <button
                          className="btn btn-warning btn-sm flex-fill"
                          onClick={() => navigate(`/admin/edit-game/${game._id}`)}
                        >
                          ✏️ Modifica
                        </button>
                        <button
                          className="btn btn-danger btn-sm flex-fill"
                          onClick={() => handleDelete(game._id)}
                        >
                          🗑️ Elimina
                        </button>
                      </div>
                    )}

                    <button
                      className="btn btn-primary w-100"
                      onClick={() => addToCart(game)}
                    >
                      Aggiungi al carrello
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Home;





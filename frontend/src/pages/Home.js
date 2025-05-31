import { useEffect, useState } from 'react';
import axios from '../services/apis';
import { useCart } from '../context/CartContext';
import { useLocation, Link } from 'react-router-dom'; // ✅ Link importato

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const location = useLocation();

  useEffect(() => {
    const fetchGames = async () => {
      try {
        const res = await axios.get('/games');
        setGames(res.data);
      } catch (err) {
        console.error('Errore nel recupero giochi:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGames();
  }, [location.key]);

  if (loading) return <p>Caricamento giochi...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎮 Giochi disponibili</h2>
      <div className="row">
        {games.map((game) => (
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
                <p className="card-text">{game.genre}</p>
                {game.discount > 0 ? (
                  <>
                    <p className="card-text text-muted text-decoration-line-through mb-1">
                      € {game.price.toFixed(2)}
                    </p>
                    <p className="card-text fw-bold text-success">
                      € {(game.price * (1 - game.discount / 100)).toFixed(2)} (-{game.discount}%)
                    </p>
                  </>
                ) : (
                  <p className="card-text fw-bold">€ {game.price.toFixed(2)}</p>
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
        ))}
      </div>
    </div>
  );
};

export default Home;



// src/pages/Home.js
import { useEffect, useState } from 'react';
import axios from '../services/apis';

const Home = () => {
  const [games, setGames] = useState([]);
  const [loading, setLoading] = useState(true);

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
  }, []);

  if (loading) return <p>Caricamento giochi...</p>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">🎮 Giochi disponibili</h2>
      <div className="row">
        {games.map(game => (
          <div className="col-md-4 mb-4" key={game._id}>
            <div className="card h-100">
              <img src={game.imageUrl} className="card-img-top" alt={game.title} />
              <div className="card-body">
                <h5 className="card-title">{game.title}</h5>
                <p className="card-text">{game.genre}</p>
                <p className="card-text fw-bold">€ {game.price.toFixed(2)}</p>
                <button className="btn btn-primary w-100">Aggiungi al carrello</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Home;

import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/apis';
import { useAuth } from '../context/AuthContext';

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [game, setGame] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [hasReviewed, setHasReviewed] = useState(false);

  useEffect(() => {
    const fetchGame = async () => {
      const res = await api.get(`/games/${id}`);
      setGame(res.data);
    };

    const fetchReviews = async () => {
      const res = await api.get(`/reviews/${id}`);
      setReviews(res.data);
      if (user) {
        const already = res.data.some(r => r.userId?._id === user.id);
        setHasReviewed(already);
      }
    };

    fetchGame();
    fetchReviews();
  }, [id, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/reviews/${id}`, { rating, comment });
      setRating(5);
      setComment('');
      setHasReviewed(true);
      const updated = await api.get(`/reviews/${id}`);
      setReviews(updated.data);
    } catch (err) {
      alert(err.response?.data?.error || 'Errore invio recensione');
    }
  };

  if (!game) return <p>Caricamento...</p>;

  const finalPrice = game.discount > 0
    ? game.price * (1 - game.discount / 100)
    : game.price;

  return (
    <div className="container mt-5">
      <h2>{game.title}</h2>
      <img src={game.imageUrl} alt={game.title} className="img-fluid my-3" />

      <p><strong>🎮 Genere:</strong> {game.genre || '—'}</p>
      <p><strong>🖥 Sistema:</strong> {game.system || '—'}</p>
      <p><strong>🛒 Piattaforma:</strong> {game.platform || '—'}</p>
      <p><strong>🏷 Tipo:</strong> {game.type || 'Gioco'}</p>
      <p><strong>📊 Stock:</strong> {game.stock ?? '—'}</p>

      <p>
        <strong>💰 Prezzo:</strong>{' '}
        {game.discount > 0 ? (
          <>
            <span className="text-muted text-decoration-line-through">
              € {game.price.toFixed(2)}
            </span>{' '}
            <span className="text-success fw-bold">
              € {finalPrice.toFixed(2)} (-{game.discount}%)
            </span>
          </>
        ) : (
          `€ ${game.price.toFixed(2)}`
        )}
      </p>

      {user?.isAdmin && (
        <div className="mb-3">
          <Link to={`/admin/edit-game/${game._id}`} className="btn btn-warning">
            ✏️ Modifica Gioco
          </Link>
        </div>
      )}

      <hr />
      <h4>🗣️ Recensioni</h4>
      {reviews.length === 0 ? (
        <p>Nessuna recensione per questo gioco.</p>
      ) : (
        <ul className="list-group mb-4">
          {reviews.map((r) => (
            <li key={r._id} className="list-group-item">
              <strong>{r.userId?.username || 'Anonimo'}</strong> — ⭐ {r.rating}/5
              <br />
              {r.comment}
              <br />
              <small>{new Date(r.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}

      {user && !hasReviewed && (
        <>
          <h5 className="mt-4">Lascia una recensione</h5>
          <form onSubmit={handleSubmit}>
            <div className="mb-2">
              <label>Voto</label>
              <select className="form-select" value={rating} onChange={e => setRating(Number(e.target.value))}>
                {[5, 4, 3, 2, 1].map(n => (
                  <option key={n} value={n}>{n} ⭐</option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <label>Commento</label>
              <textarea
                className="form-control"
                value={comment}
                onChange={e => setComment(e.target.value)}
                required
              />
            </div>
            <button className="btn btn-primary">Invia recensione</button>
          </form>
        </>
      )}

      {user && hasReviewed && (
        <p className="text-muted mt-3">Hai già recensito questo gioco.</p>
      )}
    </div>
  );
};

export default GameDetail;




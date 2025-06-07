import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/apis';
import { useAuth } from '../context/AuthContext';
import './GameDetail.css';

const GameDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const handleDelete = async () => {
    const confirm = window.confirm('Sei sicuro di voler eliminare questo gioco?');
    if (!confirm) return;

    try {
      await api.delete(`/games/${id}`);
      alert('Gioco eliminato con successo');
      navigate('/');
    } catch (err) {
      alert("Errore durante l'eliminazione");
    }
  };

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

  const getEmbedUrl = (url) => {
    if (!url) return '';
    const vimeoMatch = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (vimeoMatch) return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
    const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([\w-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}`;
    if (url.endsWith('.mp4')) return url;
    return '';
  };

  if (!game) return <p>Caricamento...</p>;

  const finalPrice = game.discount > 0
    ? game.price * (1 - game.discount / 100)
    : game.price;

  const shouldShowPrice =
    game.stock?.toLowerCase() !== 'prossimamente' || game.preorder;

  const stockDisplay =
    game.stock?.toLowerCase() === 'prossimamente' && game.preorder
      ? 'Demo'
      : game.stock ?? '—';

  return (
    <div className="container mt-5">
      <div className="row align-items-start mb-4">
        <div className="col-md-4 mb-4 game-left-col">
          <img
            src={game.imageUrl}
            alt={game.title}
            className="img-fluid game-cover"
          />

          {user?.isAdmin && (
            <div className="d-flex flex-wrap gap-2 mb-3">
              <Link to={`/admin/edit-game/${game._id}`} className="btn btn-warning">
                ✏️ Modifica Gioco
              </Link>
              <button className="btn btn-danger" onClick={handleDelete}>
                🗑️ Elimina Gioco
              </button>
            </div>
          )}

          <p><strong>🎮 Genere:</strong> {game.genre || '—'}</p>
          <p><strong>🗒 Piattaforma:</strong> {game.platform || '—'}</p>
          <p><strong>🏷 Tipo:</strong> {game.type || 'Gioco'}</p>
          <p><strong>📊 Stock:</strong> {stockDisplay}</p>

          {shouldShowPrice ? (
            <p>
              <strong>💰 Prezzo:</strong>{' '}
              {game.discount > 0 ? (
                <>
                  <span className="text-muted text-decoration-line-through me-2">
                    € {game.price.toFixed(2)}
                  </span>
                  <span className="text-success fw-bold">
                    € {finalPrice.toFixed(2)} (-{game.discount}%)
                  </span>
                </>
              ) : (
                <>€ {game.price.toFixed(2)}</>
              )}
            </p>
          ) : (
            <p><strong>💰 Prezzo:</strong> Non disponibile</p>
          )}

          {game.type === 'Gioco' && game.dlcLink && (
            <p>
              <strong>🔗 DLC disponibile:</strong>{' '}
              <a href={game.dlcLink} className="text-primary text-decoration-underline">
                Vai al contenuto aggiuntivo →
              </a>
            </p>
          )}

          {game.type === 'DLC' && game.baseGameLink && (
            <p>
              <strong>🧩 Richiede gioco base:</strong>{' '}
              <a href={game.baseGameLink} className="text-primary text-decoration-underline">
                Vai al gioco principale →
              </a>
            </p>
          )}
        </div>

        <div className="col-md-8">
          <h2 className="text-center text-md-start">{game.title}</h2>
          {game.description && (
            <p className="mt-3 text-justify game-description">
              {game.description}
            </p>
          )}

          <hr />
          <h4>🔤 Recensioni</h4>
          {reviews.length === 0 ? (
            <p>Nessuna recensione per questo gioco.</p>
          ) : (
            <div className="card mb-4">
              <div
                className="list-group"
                style={{
                  maxHeight: reviews.length > 3 ? '300px' : 'auto',
                  overflowY: reviews.length > 3 ? 'auto' : 'visible',
                }}
              >
                {reviews.map((r) => (
                  <div key={r._id} className="list-group-item">
                    <strong>{r.userId?.username || 'Anonimo'}</strong> — ⭐ {r.rating}/5
                    <br />
                    {r.comment}
                    <br />
                    <small>{new Date(r.date).toLocaleDateString()}</small>
                  </div>
                ))}
              </div>
            </div>
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
      </div>

      {game.trailerUrl && (
        <div className="trailer-wrapper">
          <h4>🎬 Trailer</h4>
          <div className="ratio ratio-16x9">
            {getEmbedUrl(game.trailerUrl).endsWith('.mp4') ? (
              <video controls src={getEmbedUrl(game.trailerUrl)} width="100%" />
            ) : (
              <iframe
                src={getEmbedUrl(game.trailerUrl)}
                title="Trailer video"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetail;




















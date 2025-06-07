// ✅ FILE: AdminEditGame.js (con supporto a dlcLink e baseGameLink)
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/apis';

const AdminEditGame = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    genre: '',
    price: '',
    discount: 0,
    stock: 1,
    platform: '',
    system: '',
    type: 'Gioco',
    description: '',
    trailerUrl: '',
    dlcLink: '',
    baseGameLink: ''
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${id}`);
        setForm(res.data);
        setOriginalForm(res.data);
      } catch (err) {
        alert('Errore nel recupero dati del gioco');
        navigate('/');
      }
    };
    fetchGame();
  }, [id, navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      Object.entries(form).forEach(([key, val]) => data.append(key, val));
      if (image) data.append('image', image);

      await api.put(`/games/${id}`, data);
      alert('Gioco aggiornato!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Errore aggiornamento');
    }
  };

  const handleRestore = () => {
    if (originalForm) {
      setForm(originalForm);
      setImage(null);
    }
  };

  const handleClear = () => {
    setForm({
      title: '',
      genre: '',
      price: '',
      discount: 0,
      stock: 1,
      platform: '',
      system: '',
      type: 'Gioco',
      description: '',
      trailerUrl: '',
      dlcLink: '',
      baseGameLink: ''
    });
    setImage(null);
  };

  const handleExit = () => {
    const confirmExit = window.confirm('Vuoi uscire senza salvare le modifiche?');
    if (confirmExit) {
      navigate('/');
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Sei sicuro di voler eliminare questo gioco?');
    if (confirmed) {
      try {
        await api.delete(`/games/${id}`);
        alert('Gioco eliminato');
        navigate('/');
      } catch (err) {
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  return (
    <div className="container mt-5">
      <h2>✏️ Modifica Gioco</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row">
          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="title"
              placeholder="Titolo"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-12">
            <textarea
              className="form-control my-2"
              name="description"
              placeholder="Descrizione del gioco"
              value={form.description}
              onChange={handleChange}
              rows={4}
            ></textarea>
          </div>

          <div className="col-12">
            <input
              className="form-control my-2"
              name="trailerUrl"
              placeholder="Link trailer (YouTube o altro)"
              value={form.trailerUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <input
              className="form-control my-2"
              name="dlcLink"
              placeholder="Link alla pagina del DLC (se presente)"
              value={form.dlcLink}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <input
              className="form-control my-2"
              name="baseGameLink"
              placeholder="Link al gioco principale (se DLC)"
              value={form.baseGameLink}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="genre"
              placeholder="Genere"
              value={form.genre}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="price"
              type="number"
              placeholder="Prezzo"
              value={form.price}
              onChange={handleChange}
              required
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="discount"
              type="number"
              placeholder="Sconto %"
              value={form.discount}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="stock"
              type="number"
              placeholder="Disponibilità"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          <div className="col-md-6">
            <select
              className="form-control my-2"
              name="platform"
              value={form.platform}
              onChange={handleChange}
            >
              <option value="">Seleziona piattaforma</option>
              <option>Steam</option>
              <option>Epic Games</option>
              <option>EA App</option>
              <option>Rockstar</option>
              <option>Ubisoft Connect</option>
              <option>Nintendo eShop</option>
              <option>Microsoft Store</option>
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-control my-2"
              name="system"
              value={form.system}
              onChange={handleChange}
            >
              <option value="">Seleziona sistema</option>
              <option>PC</option>
              <option>PlayStation 5</option>
              <option>Xbox Series X/S</option>
              <option>Switch</option>
              <option>Switch 2</option>
            </select>
          </div>

          <div className="col-md-6">
            <select
              className="form-control my-2"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option>Gioco</option>
              <option>DLC</option>
              <option>Preordine</option>
              <option>Abbonamento</option>
              <option>Carte regalo</option>
              <option>Gioco + DLC</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Cambia immagine</label>
            <input
              type="file"
              className="form-control my-2"
              onChange={handleFile}
              accept="image/png, image/jpeg"
            />
          </div>
        </div>

        <div className="d-flex gap-2 flex-wrap mt-3">
          <button type="submit" className="btn btn-primary">Salva modifiche</button>
          <button type="button" className="btn btn-info" onClick={handleRestore}>🔄 Restaura modifiche</button>
          <button type="button" className="btn btn-danger" onClick={handleClear}>🧹 Elimina modifiche</button>
          <button type="button" className="btn btn-dark" onClick={handleExit}>❌ Esci senza salvare</button>
          <button type="button" className="btn btn-outline-danger" onClick={handleDelete}>🗑️ Elimina gioco</button>
        </div>
      </form>
    </div>
  );
};

export default AdminEditGame;






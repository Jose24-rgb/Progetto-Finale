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
    stock: '',
    platform: '',
    system: '',
    type: 'Gioco',
    description: '',
    trailerUrl: '',
    dlcLink: '',
    baseGameLink: '',
    preorder: false
  });

  const [originalForm, setOriginalForm] = useState(null);
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${id}`);
        const { releaseDate, ...rest } = res.data;
        setForm(prev => ({ ...prev, ...rest }));
        setOriginalForm(rest);
      } catch (err) {
        alert('Errore nel recupero dati del gioco');
        navigate('/');
      }
    };
    fetchGame();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFile = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      const isComingSoon = form.stock.toLowerCase() === 'prossimamente';
      const price = isComingSoon && !form.preorder ? 0 : parseFloat(form.price) || 0;
      const discount = isComingSoon && !form.preorder ? 0 : parseFloat(form.discount) || 0;

      data.append('title', form.title);
      data.append('genre', form.genre);
      data.append('price', price);
      data.append('discount', discount);
      data.append('stock', form.stock);
      data.append('platform', form.platform);
      data.append('system', form.system);
      data.append('type', form.type);
      data.append('description', form.description);
      data.append('trailerUrl', form.trailerUrl);
      data.append('dlcLink', form.dlcLink);
      data.append('baseGameLink', form.baseGameLink);
      data.append('preorder', isComingSoon ? form.preorder : false);
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
      stock: '',
      platform: '',
      system: '',
      type: 'Gioco',
      description: '',
      trailerUrl: '',
      dlcLink: '',
      baseGameLink: '',
      preorder: false
    });
    setImage(null);
  };

  const handleExit = () => {
    if (window.confirm('Vuoi uscire senza salvare le modifiche?')) {
      navigate('/');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Sei sicuro di voler eliminare questo gioco?')) {
      try {
        await api.delete(`/games/${id}`);
        alert('Gioco eliminato');
        navigate('/');
      } catch (err) {
        alert('Errore durante l\'eliminazione');
      }
    }
  };

  const isComingSoon = form.stock.toLowerCase() === 'prossimamente';
  const disablePriceFields = isComingSoon && !form.preorder;

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
              placeholder="Link trailer"
              value={form.trailerUrl}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <input
              className="form-control my-2"
              name="dlcLink"
              placeholder="Link DLC"
              value={form.dlcLink}
              onChange={handleChange}
            />
          </div>

          <div className="col-12">
            <input
              className="form-control my-2"
              name="baseGameLink"
              placeholder="Link gioco principale"
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
              required={!disablePriceFields}
              disabled={disablePriceFields}
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
              disabled={disablePriceFields}
            />
          </div>

          <div className="col-md-6">
            <input
              className="form-control my-2"
              name="stock"
              type="text"
              placeholder="Disponibilità (es. 'Prossimamente')"
              value={form.stock}
              onChange={handleChange}
            />
          </div>

          {isComingSoon && (
            <div className="col-12">
              <div className="form-check my-2">
                <input
                  className="form-check-input"
                  type="checkbox"
                  name="preorder"
                  checked={form.preorder}
                  onChange={handleChange}
                  id="preorderCheck"
                />
                <label className="form-check-label" htmlFor="preorderCheck">
                  ✅ Abilita preordine per questo gioco
                </label>
              </div>
            </div>
          )}

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
              <option>PlayStation Store</option>
              <option>Xbox Store</option>
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









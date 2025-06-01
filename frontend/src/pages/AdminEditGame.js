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
  });
  const [image, setImage] = useState(null);

  useEffect(() => {
    const fetchGame = async () => {
      try {
        const res = await api.get(`/games/${id}`);
        setForm(res.data);
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

  return (
    <div className="container mt-5">
      <h2>✏️ Modifica Gioco</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          className="form-control my-2"
          name="title"
          placeholder="Titolo"
          value={form.title}
          onChange={handleChange}
          required
        />
        <input
          className="form-control my-2"
          name="genre"
          placeholder="Genere"
          value={form.genre}
          onChange={handleChange}
        />
        <input
          className="form-control my-2"
          name="price"
          type="number"
          placeholder="Prezzo"
          value={form.price}
          onChange={handleChange}
          required
        />
        <input
          className="form-control my-2"
          name="discount"
          type="number"
          placeholder="Sconto %"
          value={form.discount}
          onChange={handleChange}
        />
        <input
          className="form-control my-2"
          name="stock"
          type="number"
          placeholder="Disponibilità"
          value={form.stock}
          onChange={handleChange}
        />

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

        <label className="form-label">Cambia immagine</label>
        <input
          type="file"
          className="form-control my-2"
          onChange={handleFile}
          accept="image/png, image/jpeg"
        />

        <button className="btn btn-primary">Salva modifiche</button>
      </form>
    </div>
  );
};

export default AdminEditGame;


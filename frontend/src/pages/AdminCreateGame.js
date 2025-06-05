import { useState } from 'react';
import api from '../services/apis';
import { useNavigate } from 'react-router-dom';

const AdminCreateGame = () => {
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
  const navigate = useNavigate();

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
      Object.entries(form).forEach(([key, val]) => {
        if (val) data.append(key, val);
      });
      if (image) data.append('image', image);

      await api.post('/games', data);
      alert('Gioco creato con successo!');
      navigate('/');
    } catch (err) {
      alert(err.response?.data?.error || 'Errore creazione gioco');
    }
  };

  return (
    <div className="container mt-5">
      <h2>📥 Crea nuovo gioco</h2>
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
              required
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
              required
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
              required
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
            <input
              type="file"
              className="form-control my-2"
              onChange={handleFile}
              accept="image/png, image/jpeg"
            />
          </div>
        </div>
        <button className="btn btn-success mt-3">Crea gioco</button>
      </form>
    </div>
  );
};

export default AdminCreateGame;



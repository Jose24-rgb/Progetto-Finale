import { useState } from 'react';

const Filters = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    system: '',
    platform: '',
    genre: '',
    sort: '',
    type: '',
    priceMin: '',
    priceMax: '',
    inStock: false
  });

  const systems = ['PC', 'PlayStation 5', 'Xbox Series X|S', 'Switch', 'Switch 2'];
  const platforms = ['Epic Games', 'Steam', 'EA App', 'Rockstar', 'Ubisoft Connect', 'Nintendo eShop', 'Microsoft Store'];
  const genres = ['Altro', 'Arcade', 'Avventura', 'Azione', 'FPS', 'MMO', 'Indies', 'Coop online', 'Free to Play']; // <-- Puoi estenderli
  const types = ['Tutto', 'Giochi e DLC', 'Solo DLC', 'Solo giochi', 'Preordini', 'Carte regalo', 'Abbonamenti'];

  const sorts = [
    'Bestseller',
    'Sconto: migliore',
    'Prezzo: da basso ad alto',
    'Prezzo: da alto a basso',
    'Uscita: nuovo',
    'Uscita: vecchio',
    'Recensioni: migliore',
    'Recensioni: peggiore'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const newFilters = { ...filters, [name]: val };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="row mb-4">
      <div className="col-md-2">
        <select className="form-select" name="system" onChange={handleChange}>
          <option value="">Sistemi</option>
          {systems.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-md-2">
        <select className="form-select" name="platform" onChange={handleChange}>
          <option value="">Piattaforme</option>
          {platforms.map(p => <option key={p} value={p}>{p}</option>)}
        </select>
      </div>
      <div className="col-md-2">
        <select className="form-select" name="genre" onChange={handleChange}>
          <option value="">Generi...</option>
          {genres.map(g => <option key={g} value={g}>{g}</option>)}
        </select>
      </div>
      <div className="col-md-2">
        <select className="form-select" name="sort" onChange={handleChange}>
          <option value="">Ordina per:</option>
          {sorts.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="col-md-1">
        <input
          type="number"
          name="priceMin"
          className="form-control"
          placeholder="Min €"
          onChange={handleChange}
        />
      </div>
      <div className="col-md-1">
        <input
          type="number"
          name="priceMax"
          className="form-control"
          placeholder="Max €"
          onChange={handleChange}
        />
      </div>
      <div className="col-md-1 d-flex align-items-center">
        <input
          type="checkbox"
          name="inStock"
          className="form-check-input me-2"
          onChange={handleChange}
        />
        <label className="form-check-label">In stock</label>
      </div>
      <div className="col-md-1">
        <select className="form-select" name="type" onChange={handleChange}>
          {types.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </div>
    </div>
  );
};

export default Filters;

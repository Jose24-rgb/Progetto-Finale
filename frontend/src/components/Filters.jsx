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
  const genres = ['Altro', 'Arcade', 'Avventura', 'Azione', 'FPS', 'MMO', 'Indies', 'Coop online', 'Free to Play'];

  const types = [
    { label: 'Tutto', value: '' },
    { label: 'Giochi e DLC', value: 'Gioco + DLC' },
    { label: 'Solo DLC', value: 'DLC' },
    { label: 'Solo giochi', value: 'Gioco' },
    { label: 'Preordini', value: 'Preordine' },
    { label: 'Carte regalo', value: 'Carte regalo' },
    { label: 'Abbonamenti', value: 'Abbonamento' }
  ];

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
    <div className="mb-4 d-flex flex-column align-items-center">
      {/* Prima riga */}
      <div className="row mb-3 w-100 justify-content-center" style={{ maxWidth: '1000px' }}>
        <div className="col-md-3 mb-2">
          <select className="form-select form-select-lg" name="system" onChange={handleChange}>
            <option value="">Sistemi</option>
            {systems.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select form-select-lg" name="platform" onChange={handleChange}>
            <option value="">Piattaforme</option>
            {platforms.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select form-select-lg" name="genre" onChange={handleChange}>
            <option value="">Generi...</option>
            {genres.map(g => <option key={g} value={g}>{g}</option>)}
          </select>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select form-select-lg" name="sort" onChange={handleChange}>
            <option value="">Ordina per:</option>
            {sorts.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Seconda riga */}
      <div className="row w-100 justify-content-center" style={{ maxWidth: '1000px' }}>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            name="priceMin"
            className="form-control form-control-lg"
            placeholder="Min €"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 mb-2">
          <input
            type="number"
            name="priceMax"
            className="form-control form-control-lg"
            placeholder="Max €"
            onChange={handleChange}
          />
        </div>
        <div className="col-md-2 d-flex align-items-center mb-2">
          <input
            type="checkbox"
            name="inStock"
            className="form-check-input me-2"
            onChange={handleChange}
            style={{ transform: 'scale(1.5)' }}
          />
          <label className="form-check-label">In stock</label>
        </div>
        <div className="col-md-3 mb-2">
          <select className="form-select form-select-lg" name="type" onChange={handleChange}>
            {types.map(t => (
              <option key={t.label} value={t.value}>{t.label}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default Filters;





import { useState } from 'react';
import './Filters.css';

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
    'Bestseller', 'Sconto: migliore', 'Prezzo: da basso ad alto',
    'Prezzo: da alto a basso', 'Uscita: nuovo', 'Uscita: vecchio',
    'Recensioni: migliore', 'Recensioni: peggiore'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === 'checkbox' ? checked : value;
    const newFilters = { ...filters, [name]: val };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleClear = (name) => {
    const newFilters = { ...filters, [name]: '' };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const renderSelect = (name, label, options) => (
    <div className="col-md-3 mb-2 select-wrapper">
      <select
        className={`form-select form-select-lg ${filters[name] ? 'no-arrow' : ''}`}
        name={name}
        value={filters[name]}
        onChange={handleChange}
      >
        <option value="">{label}</option>
        {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
      </select>
      {filters[name] && (
        <button
          type="button"
          className="clear-btn"
          onClick={() => handleClear(name)}
        >
          &times;
        </button>
      )}
    </div>
  );

  return (
    <div className="mb-4 d-flex flex-column align-items-center">
      <div className="row mb-3 w-100 justify-content-center" style={{ maxWidth: '1000px' }}>
        {renderSelect('system', 'Sistemi', systems)}
        {renderSelect('platform', 'Piattaforme', platforms)}
        {renderSelect('genre', 'Generi...', genres)}
        {renderSelect('sort', 'Ordina per:', sorts)}
      </div>

      <div className="row w-100 justify-content-center" style={{ maxWidth: '1000px' }}>
        <div className="col-auto mb-2">
          <input
            type="number"
            name="priceMin"
            className="form-control form-control-lg text-center"
            placeholder="Min €"
            value={filters.priceMin}
            onChange={handleChange}
            style={{ width: '100px' }}
          />
        </div>
        <div className="col-auto mb-2">
          <input
            type="number"
            name="priceMax"
            className="form-control form-control-lg text-center"
            placeholder="Max €"
            value={filters.priceMax}
            onChange={handleChange}
            style={{ width: '100px' }}
          />
        </div>
        <div className="col-md-2 stock-checkbox-wrapper mb-2">
        <input
          type="checkbox"
          name="inStock"
          className="form-check-input me-2"
          onChange={handleChange}
          onMouseUp={(e) => e.currentTarget.blur()} // Rimuove il focus dopo il click
          checked={filters.inStock}
          style={{ transform: 'scale(1.5)' }}
       />

          <label className="form-check-label">In stock</label>
        </div>
        <div className="col-md-3 mb-2">
          <select
            className="form-select form-select-lg"
            name="type"
            value={filters.type}
            onChange={handleChange}
          >
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









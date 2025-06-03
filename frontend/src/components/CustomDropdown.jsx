import { useState } from 'react';
import './Dropdown.css';

const CustomDropdown = ({ name, label = 'Sistemi', options = [], value, onChange }) => {
  const [open, setOpen] = useState(false);

  const handleSelect = (option) => {
    const fakeEvent = {
      target: {
        name,
        value: option // option è già una stringa
      }
    };
    onChange(fakeEvent);
    setOpen(false);
  };

  const handleClear = () => {
    const fakeEvent = {
      target: {
        name,
        value: ''
      }
    };
    onChange(fakeEvent);
    setOpen(false);
  };

  return (
    <div className="dropdown-container">
  <div
    className="dropdown-header"
    onClick={() => setOpen(!open)}
    tabIndex={0}
    onBlur={() => setTimeout(() => setOpen(false), 100)}
  >
    {value || label}
    <span className="arrow">{open ? '▲' : '▼'}</span>
  </div>

  {value && (
    <button
      type="button"
      className="clear-btn"
      onClick={handleClear}
    >
      &times;
    </button>
  )}

  {open && (
    <ul className="dropdown-list">
      {options.map((opt) => (
        <li
          key={opt}
          onClick={() => handleSelect(opt)}
          className="dropdown-item"
        >
          {opt}
        </li>
      ))}
    </ul>
  )}
</div>

  );
};

export default CustomDropdown;


      
    
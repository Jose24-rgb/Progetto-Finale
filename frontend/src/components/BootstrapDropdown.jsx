import { Dropdown } from 'react-bootstrap';
import './BootstrapDropdown.css';

const BootstrapDropdown = ({ name, label = 'Seleziona', options = [], value, onChange }) => {
  const handleSelect = (selectedValue) => {
    const fakeEvent = {
      target: {
        name,
        value: selectedValue,
      }
    };
    onChange(fakeEvent);
  };

  const handleClear = (e) => {
    e.preventDefault();
    const fakeEvent = {
      target: {
        name,
        value: ''
      }
    };
    onChange(fakeEvent);
  };

  // Mostra la X solo se c'è un valore selezionato diverso dal label iniziale
  const shouldShowClear = value && value !== '' && value !== label;

  return (
    <div className="position-relative select-wrapper">
      <Dropdown onSelect={handleSelect} className="w-100 dropdown-wrapper">
        <Dropdown.Toggle
          as="button"
          type="button"
          className="custom-toggle dropdown-toggle"
        >
          {value || label}
        </Dropdown.Toggle>

        <Dropdown.Menu className="w-100">
          {options.map((opt) => (
            <Dropdown.Item key={opt} eventKey={opt}>
              {opt}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>

      {shouldShowClear && (
        <button
          type="button"
          className="clear-btn"
          onClick={handleClear}
          title="Cancella selezione"
        >
          ×
        </button>
      )}
    </div>
  );
};

export default BootstrapDropdown;








      
    
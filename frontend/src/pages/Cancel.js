import { Link } from 'react-router-dom';

const Cancel = () => {
  return (
    <div className="container mt-5">
      <h2>❌ Pagamento annullato</h2>
      <p>Sembra che il pagamento non sia andato a buon fine o sia stato annullato.</p>
      <Link to="/cart" className="btn btn-warning mt-3">
        Torna al carrello
      </Link>
    </div>
  );
};

export default Cancel;

import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Success = () => {
  const location = useLocation();
  const { clearCart } = useCart();
  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="container mt-5">
      <h2>✅ Pagamento completato!</h2>
      <p>Grazie per il tuo acquisto. Il tuo ordine è stato registrato con successo.</p>
      {orderId && (
        <p>
          ID Ordine: <strong>{orderId}</strong>
        </p>
      )}
      <Link to="/" className="btn btn-primary mt-3">
        Torna alla Home
      </Link>
    </div>
  );
};

export default Success;

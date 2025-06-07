import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const Success = () => {
  const location = useLocation();
  const { clearCart } = useCart();

  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    clearCart();
    setTimeout(() => {
      window.location.href = '/';
    }, 2000);
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
      <button className="btn btn-primary mt-3" onClick={() => window.location.href = '/'}>
        Torna alla Home
      </button>
    </div>
  );
};

export default Success;



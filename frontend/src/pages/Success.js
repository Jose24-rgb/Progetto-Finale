import { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from '../services/apis';

const Success = () => {
  const location = useLocation();
  const { clearCart, cart } = useCart();
  const { user } = useAuth();

  const params = new URLSearchParams(location.search);
  const orderId = params.get('orderId');

  useEffect(() => {
    const saveOrder = async () => {
      try {
        const total = cart.reduce((acc, g) => acc + g.price * g.quantity, 0);

        await axios.post('/orders', {
          userId: user.user.id,
          games: cart.map(g => ({ gameId: g._id, quantity: g.quantity })),
          total,
        });

        clearCart();
      } catch (err) {
        console.error('❌ Errore nel salvataggio ordine:', err);
      }
    };

    if (cart.length > 0 && user) {
      saveOrder();
    } else {
      clearCart(); // fallback
    }
  }, [cart, clearCart, user]);

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


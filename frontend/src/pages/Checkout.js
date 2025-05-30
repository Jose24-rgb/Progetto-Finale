import { useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/apis';

const Checkout = () => {
  const { cart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const createSession = async () => {
      try {
        const res = await api.post('/checkout/create-checkout-session', {
          userId: user.user.id,
          email: user.user.email,
          games: cart
        });
        window.location.href = res.data.url; // Redirect to Stripe
      } catch (err) {
        console.error('Errore Stripe:', err.response?.data?.error);
        alert('Errore nel checkout. Riprova.');
      }
    };

    if (user && cart.length > 0) {
      createSession();
    }
  }, [user, cart]);

  return <p>🔄 Reindirizzamento a Stripe...</p>;
};

export default Checkout;

import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import axios from '../services/apis';
import { useAuth } from '../context/AuthContext';

function Cart() {
  const { cart, removeFromCart } = useCart();
  const { user } = useAuth();

  const total = cart.reduce((acc, game) => acc + game.price * game.quantity, 0);

  const handleCheckout = async () => {
    if (!user) {
      alert('Devi effettuare il login per procedere.');
      return;
    }

    try {
      const res = await axios.post('/checkout/create-checkout-session', {
        userId: user.user.id,
        games: cart,
      });

      window.location.href = res.data.url;
    } catch (err) {
      console.error('❌ Errore nel checkout:', err);
      alert('Errore nel processo di pagamento.');
    }
  };

  return (
    <div className="container mt-5">
      <h2>🛒 Il tuo carrello</h2>
      {cart.length === 0 ? (
        <p>Il carrello è vuoto. <Link to="/">Torna alla home</Link></p>
      ) : (
        <>
          <ul className="list-group mb-4">
            {cart.map((game, index) => (
              <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong>{game.title}</strong> — € {game.price.toFixed(2)} × {game.quantity}
                </div>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => removeFromCart(game._id)}
                >
                  Rimuovi
                </button>
              </li>
            ))}
          </ul>
          <h4>Totale: € {total.toFixed(2)}</h4>
          <button className="btn btn-success w-100 mt-3" onClick={handleCheckout}>
            Procedi al pagamento con Stripe
          </button>
        </>
      )}
    </div>
  );
}

export default Cart;



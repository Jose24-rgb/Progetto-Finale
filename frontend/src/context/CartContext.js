import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState([]);

  useEffect(() => {
    if (user?.id) {
      const storedCart = localStorage.getItem(`cart_${user.id}`);
      setCart(storedCart ? JSON.parse(storedCart) : []);
    } else {
      setCart([]);
    }
  }, [user]);

  useEffect(() => {
    if (user?.id) {
      localStorage.setItem(`cart_${user.id}`, JSON.stringify(cart));
    }
  }, [cart, user]);

  const addToCart = (game) => {
    setCart(prev =>
      prev.some(g => g._id === game._id)
        ? prev.map(g => g._id === game._id ? { ...g, quantity: g.quantity + 1 } : g)
        : [...prev, { ...game, quantity: 1 }]
    );
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(game => game._id !== id));
  };

  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);





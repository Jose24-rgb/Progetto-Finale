import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

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



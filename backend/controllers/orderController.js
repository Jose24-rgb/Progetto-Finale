const Order = require('../models/Order');

exports.createOrder = async (req, res) => {
  const { userId, games, total } = req.body;

  if (!userId || !games || games.length === 0 || typeof total !== 'number') {
    return res.status(400).json({ error: 'Dati ordine mancanti o non validi' });
  }

  try {
    const newOrder = await Order.create({ userId, games, total });
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: 'Errore durante la creazione dell\'ordine' });
  }
};


exports.getUserOrders = async (req, res) => {
  const orders = await Order.find({ userId: req.params.userId });
  res.json(orders);
};

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const Game = require('../models/Game');
const mongoose = require('mongoose');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

router.post('/', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('❌ Verifica firma fallita:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const userId = session.metadata?.userId;
    const orderId = session.metadata?.orderId;
    let games = [];

    try {
      games = JSON.parse(session.metadata?.games || '[]');
    } catch (err) {
      console.error('❌ Errore parsing giochi:', err.message);
    }

    try {
      const exists = await Order.findById(orderId);
      if (exists) {
        console.log('⚠️ Ordine già esistente');
        return res.status(200).json({ received: true });
      }

      // 1. Salva l’ordine
      await Order.create({
        _id: orderId,
        userId: new mongoose.Types.ObjectId(userId),
        games: games.map(g => ({
          gameId: g._id,
          quantity: g.quantity
        })),
        total: session.amount_total / 100,
        date: new Date(),
        status: 'pagato'
      });

      console.log('✅ Ordine salvato con successo');

      // 2. Aggiorna lo stock di ogni gioco
      for (const g of games) {
        const game = await Game.findById(g._id);
        if (game && typeof game.stock === 'number') {
          const newStock = Math.max(game.stock - g.quantity, 0);
          await Game.findByIdAndUpdate(g._id, { stock: newStock });
        }
      }

      console.log('📉 Stock aggiornato con successo');

    } catch (err) {
      console.error('❌ Errore salvataggio ordine o aggiornamento stock:', err.message);
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;



require('dotenv').config();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
const mongoose = require('mongoose');

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  // Verifica la firma dell'evento
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`❌ Webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // Gestisci evento completamento pagamento
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { orderId, userId, games } = session.metadata;

    console.log('📦 Evento Stripe ricevuto - checkout.session.completed');
    console.log('🧾 orderId:', orderId);
    console.log('👤 userId:', userId);
    console.log('🎮 games (stringa):', games);

    try {
      const parsedGames = JSON.parse(games);
      const exists = await Order.findOne({ _id: orderId });

      if (exists) {
        console.log('⚠️ Ordine già esistente, non verrà duplicato.');
        return res.status(200).json({ received: true });
      }

      const newOrder = await Order.create({
        _id: orderId,
        userId: new mongoose.Types.ObjectId(userId),
        games: parsedGames.map(g => ({
          gameId: g._id,
          quantity: g.quantity
        })),
        total: session.amount_total / 100,
        status: 'pagato',
        date: new Date()
      });

      console.log('✅ Ordine salvato nel database:', newOrder._id);
      return res.status(200).json({ received: true });

    } catch (e) {
      console.error('❌ Errore durante il salvataggio ordine Stripe:', e.message);
      return res.status(500).json({ error: e.message });
    }
  }

  // Per altri eventi non gestiti
  res.status(200).json({ received: true });
};







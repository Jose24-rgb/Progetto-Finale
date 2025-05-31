require('dotenv').config();
const Order = require('../models/Order');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error(`Webhook signature error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const { orderId, userId, games } = session.metadata;

    try {
      const parsedGames = JSON.parse(games);
      const total = parsedGames.reduce((acc, game) => acc + game.price * game.quantity, 0);

      const exists = await Order.findOne({ orderId });
      if (exists) {
        console.log('⚠️ Ordine già salvato');
        return res.status(200).json({ received: true });
      }

      await Order.create({
        orderId,
        userId,
        games: parsedGames.map(g => ({ gameId: g._id, quantity: g.quantity })),
        total,
        status: 'pagato',
        date: new Date()
      });

      console.log('✅ Ordine salvato');
    } catch (e) {
      console.error('❌ Errore salvataggio ordine:', e.message);
    }
  }

  res.status(200).json({ received: true });
};



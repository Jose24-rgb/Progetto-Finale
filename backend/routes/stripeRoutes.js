const express = require('express');
const router = express.Router();
const { createCheckoutSession } = require('../controllers/stripeController');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');
const transporter = require('../utils/mailer');
const mongoose = require('mongoose');

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;


const isValidEmail = email => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);


const sendErrorEmailToCustomer = async (email, message) => {
  if (!isValidEmail(email)) return;
  try {
    await transporter.sendMail({
      from: `"GameDev Shop" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: '❌ Errore nel tuo ordine',
      html: `<p>${message}</p>`
    });
  } catch (err) {
    console.error('❌ Fallita email errore cliente:', err.message);
  }
};

/**
 * @swagger
 * /api/checkout/create-checkout-session:
 *   post:
 *     summary: Crea una sessione di pagamento con Stripe
 *     tags: [Pagamento]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, games]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60b6c0c1f1c2b530cc98e6d1"
 *               games:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60b6c0c1f1c2b530cc98e6d2"
 *                     title:
 *                       type: string
 *                       example: Cyberpunk 2077
 *                     price:
 *                       type: number
 *                       example: 59.99
 *                     quantity:
 *                       type: number
 *                       example: 1
 *     responses:
 *       200:
 *         description: URL di checkout creato
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
router.post('/create-checkout-session', createCheckoutSession);


router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
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
    const userId = session.metadata?.userId || null;
    const orderId = session.metadata?.orderId || null;
    const email = session.customer_details?.email;
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

      await Order.create({
        _id: orderId,
        userId: new mongoose.Types.ObjectId(userId), // 👈 forzato ObjectId corretto
        games: games.map(g => ({ gameId: g._id, quantity: g.quantity })),
        total: session.amount_total / 100,
        date: new Date(),
        status: 'pagato'
      });

      console.log('✅ Ordine salvato con successo');

      if (isValidEmail(email)) {
        await transporter.sendMail({
          from: `"GameDev Shop" <${process.env.EMAIL_USER}>`,
          to: email,
          subject: 'Conferma Ordine ✔',
          html: `
            <h2>Grazie per il tuo acquisto!</h2>
            <p>Totale: <strong>€${(session.amount_total / 100).toFixed(2)}</strong></p>
            <p>ID Ordine: <code>${orderId}</code></p>
          `
        });
        console.log(`📧 Email inviata a ${email}`);
      } else {
        console.warn('⚠️ Email cliente non valida');
      }

      await transporter.sendMail({
        from: `"GameDev Shop" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER,
        subject: `📥 Nuovo Ordine da ${email || 'Cliente'}`,
        html: `
          <h3>Nuovo ordine ricevuto</h3>
          <p>Totale: €${(session.amount_total / 100).toFixed(2)}</p>
          <p>ID ordine: ${orderId}</p>
        `
      });
      console.log('📧 Notifica admin inviata');

    } catch (err) {
      console.error('❌ Errore salvataggio ordine:', err.message);

      if (isValidEmail(email)) {
        await sendErrorEmailToCustomer(email, 'C’è stato un problema nel completare il tuo ordine. Il nostro team è stato avvisato.');
      }
    }
  }

  res.status(200).json({ received: true });
});

module.exports = router;









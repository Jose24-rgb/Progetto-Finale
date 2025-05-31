const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');
const { stripeWebhook } = require('./controllers/webhookStripe');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
connectDB();

// ✅ Webhook Stripe con express.raw()
app.post('/api/checkout/webhook', express.raw({ type: 'application/json' }), stripeWebhook);

// Sicurezza
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Troppe richieste dal tuo IP, riprova più tardi.'
});
app.use(limiter);

// ✅ Body parser solo dopo webhook
app.use(express.json());
app.use(cors());

// Swagger UI
setupSwagger(app);

// API routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/checkout', require('./routes/stripeRoutes'));

module.exports = app;

// Server
if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}





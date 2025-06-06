const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');

// Carica variabili ambiente
dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
app.set('trust proxy', 1);

// Connessione al DB
connectDB();

// Sicurezza base
app.use(helmet());

// CORS ✅ Deve essere prima di tutte le route
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Limita le richieste
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Troppe richieste dal tuo IP, riprova più tardi.'
});
app.use(limiter);

// Body parser
app.use(express.json());

// Route speciale che richiede raw body
app.use('/api/checkout/webhook', require('./routes/stripeWebhookRoute'));

// Altre route
setupSwagger(app);
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/checkout', require('./routes/stripeRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Esportazione app
module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}













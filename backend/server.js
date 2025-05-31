const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const setupSwagger = require('./config/swagger');

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env'
});

const app = express();
app.set('trust proxy', 1); // <--- ✅ AGGIUNTA PER EVITARE WARNING CON NGROK
connectDB();

// Sicurezza
app.use(helmet());

// Limite richieste
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Troppe richieste dal tuo IP, riprova più tardi.'
});
app.use(limiter);

// ⚠️ Importante: RAW BODY PRIMA DI express.json()
app.use('/api/checkout/webhook', require('./routes/stripeWebhookRoute'));

// Ora JSON e CORS per il resto
app.use(express.json());
app.use(cors());

// Swagger
setupSwagger(app);

// Altre API
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/games', require('./routes/gameRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/checkout', require('./routes/stripeRoutes'));

module.exports = app;

if (require.main === module) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
}











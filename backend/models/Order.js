const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true }, // 🔥 Aggiunto
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // 👈 rinominato per coerenza
  games:   [{ gameId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  total:   Number,
  date:    { type: Date, default: Date.now },
  status:  { type: String, default: 'pagato' } // 🔥 Aggiunto se vuoi tenere traccia
});

module.exports = mongoose.model('Order', orderSchema);


const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  _id:      { type: String, required: true },
  userId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  games:    [{ gameId: mongoose.Schema.Types.ObjectId, quantity: Number }],
  total:    { type: Number, required: true },
  date:     { type: Date, default: Date.now },
  status:   { type: String, default: 'pagato' }
});

module.exports = mongoose.model('Order', orderSchema);





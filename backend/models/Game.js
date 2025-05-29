const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  genre:     { type: String },
  price:     { type: Number, required: true },
  imageUrl:  { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);

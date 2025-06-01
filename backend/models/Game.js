const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title:     { type: String, required: true },
  genre:     { type: String },
  price:     { type: Number, required: true },
  discount:  { type: Number, default: 0 },
  imageUrl:  { type: String },

  // 🔽 Nuovi campi con validazione enum
  platform: {
    type: String,
    enum: [
      'Steam',
      'Epic Games',
      'EA App',
      'Rockstar',
      'Ubisoft Connect',
      'Nintendo eShop',
      'Microsoft Store'
    ]
  },

  system: {
    type: String,
    enum: [
      'PC',
      'PlayStation 5',
      'Xbox Series X/S',
      'Switch',
      'Switch 2'
    ]
  },

  type: {
    type: String,
    enum: ['Gioco', 'DLC', 'Preordine', 'Abbonamento', 'Carte regalo'],
    default: 'Gioco'
  },

  stock:      { type: Number, default: 1 },
  reviewsAvg: { type: Number, default: 0 },

  createdAt:  { type: Date, default: Date.now }
});

module.exports = mongoose.model('Game', gameSchema);




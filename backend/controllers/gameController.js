const Game = require('../models/Game');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.getAllGames = async (req, res) => {
  const games = await Game.find();
  res.json(games);
};

exports.getGameById = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'ID non valido' });
  }

  const game = await Game.findById(id);
  if (!game) return res.status(404).json({ error: 'Gioco non trovato' });

  res.json(game);
};

exports.createGame = async (req, res) => {
  try {
    const { title, genre, price } = req.body;
    let imageUrl = '';

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri);
      imageUrl = result.secure_url;
    }

    const newGame = await Game.create({ title, genre, price, imageUrl });
    res.status(201).json(newGame);
  } catch (err) {
    console.error('❌ Errore creazione gioco:', err.message);
    res.status(500).json({ error: 'Errore nel creare il gioco' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri);
      updateData.imageUrl = result.secure_url;
    }

    const updated = await Game.findByIdAndUpdate(req.params.id, updateData, { new: true });
    res.json(updated);
  } catch (err) {
    console.error('❌ Errore aggiornamento gioco:', err.message);
    res.status(500).json({ error: 'Errore nell\'aggiornare il gioco' });
  }
};

exports.deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.status(204).end();
};



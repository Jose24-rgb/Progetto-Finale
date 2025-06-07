const Game = require('../models/Game');
const { cloudinary } = require('../config/cloudinary');
const mongoose = require('mongoose');

exports.getAllGames = async (req, res) => {
  try {
    const {
      genre,
      platform,
      system,
      type,
      sort,
      priceMin,
      priceMax,
      inStock
    } = req.query;

    const filter = {};
    if (genre) filter.genre = { $regex: new RegExp(genre, 'i') };
    if (platform) filter.platform = platform;
    if (system) filter.system = system;

    // ✅ Gestione filtro "Preordine"
    if (type && type !== 'Tutto') {
      if (type === 'Preordine') {
        filter.$or = [
          { type: 'Preordine' },
          { preorder: true }
        ];
      } else {
        filter.type = type;
      }
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) filter.price.$gte = parseFloat(priceMin);
      if (priceMax) filter.price.$lte = parseFloat(priceMax);
    }

    if (inStock === 'true') {
      filter.stock = { $ne: '0' };
    }

    let sortOption = {};
    switch (sort) {
      case 'Prezzo: da basso ad alto':
        sortOption.price = 1;
        break;
      case 'Prezzo: da alto a basso':
        sortOption.price = -1;
        break;
      case 'Sconto: migliore':
        sortOption.discount = -1;
        break;
      case 'Recensioni: migliore':
        sortOption.reviewsAvg = -1;
        break;
      case 'Uscita: nuovo':
        sortOption.createdAt = -1;
        break;
      case 'Uscita: vecchio':
        sortOption.createdAt = 1;
        break;
      case 'Bestseller':
      default:
        sortOption = { createdAt: -1 };
        break;
    }

    const games = await Game.find(filter).sort(sortOption);
    res.json(games);
  } catch (err) {
    console.error('❌ Errore filtro giochi:', err.message);
    res.status(500).json({ error: 'Errore nel recupero dei giochi' });
  }
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
    const {
      title,
      genre,
      price,
      discount,
      stock,
      platform,
      system,
      type,
      preorder,
      description,
      trailerUrl,
      dlcLink,
      baseGameLink,
    } = req.body;

    let imageUrl = '';
    if (req.file) {
      const base64 = req.file.buffer.toString('base64');
      const dataUri = `data:${req.file.mimetype};base64,${base64}`;
      const result = await cloudinary.uploader.upload(dataUri);
      imageUrl = result.secure_url;
    }

    const newGame = await Game.create({
      title,
      genre,
      price,
      discount,
      stock,
      platform,
      system,
      type: preorder === 'true' || preorder === true ? 'Preordine' : type,
      preorder: preorder === 'true' || preorder === true,
      description,
      trailerUrl,
      dlcLink,
      baseGameLink,
      imageUrl
    });

    res.status(201).json(newGame);
  } catch (err) {
    console.error('❌ Errore creazione gioco:', err.message);
    res.status(500).json({ error: 'Errore nel creare il gioco' });
  }
};

exports.updateGame = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // ✅ Forza il tipo Preordine se richiesto
    if (updateData.preorder === 'true' || updateData.preorder === true) {
      updateData.type = 'Preordine';
      updateData.preorder = true;
    } else {
      updateData.preorder = false;
    }

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
    res.status(500).json({ error: "Errore nell'aggiornare il gioco" });
  }
};

exports.deleteGame = async (req, res) => {
  await Game.findByIdAndDelete(req.params.id);
  res.status(204).end();
};














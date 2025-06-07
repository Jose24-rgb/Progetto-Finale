const Order = require('../models/Order');
const mongoose = require('mongoose');
const Game = require('../models/Game');

exports.createOrder = async (req, res) => {
  const { userId, games, total } = req.body;

  if (!userId || !games || games.length === 0 || typeof total !== 'number') {
    return res.status(400).json({ error: 'Dati ordine mancanti o non validi' });
  }

  try {
    // Carichiamo i giochi per verificare quali sono preordinabili
    const gameIds = games.map(g => g.gameId);
    const foundGames = await Game.find({ _id: { $in: gameIds } });

    const gamesWithPreorderFlag = games.map(item => {
      const gameInfo = foundGames.find(g => g._id.toString() === item.gameId);
      const isPreorder = gameInfo?.stock?.toLowerCase() === 'prossimamente' && gameInfo?.preorder === true;
      return {
        ...item,
        isPreorder: isPreorder || false
      };
    });

    const newOrder = await Order.create({
      _id: new mongoose.Types.ObjectId().toString(),
      userId,
      games: gamesWithPreorderFlag,
      total,
      status: 'pagato'
    });

    res.status(201).json(newOrder);
  } catch (err) {
    console.error('❌ Errore nella creazione ordine:', err);
    res.status(500).json({ error: 'Errore durante la creazione dell\'ordine' });
  }
};






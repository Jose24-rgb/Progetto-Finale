const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');

// Tutte le recensioni per un gioco
router.get('/:gameId', getReviews);

// Aggiungi recensione (solo autenticato)
router.post('/:gameId', verifyToken, addReview);

// Cancella recensione (solo admin)
router.delete('/:id', verifyToken, isAdmin, deleteReview);

module.exports = router;

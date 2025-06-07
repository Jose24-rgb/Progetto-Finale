const express = require('express');
const router = express.Router();
const { getReviews, addReview, deleteReview } = require('../controllers/reviewController');
const verifyToken = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/isAdmin');


router.get('/:gameId', getReviews);


router.post('/:gameId', verifyToken, addReview);


router.delete('/:id', verifyToken, isAdmin, deleteReview);

module.exports = router;

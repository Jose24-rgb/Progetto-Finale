const Review = require('../models/Review');

exports.getReviews = async (req, res) => {
  const { gameId } = req.params;
  const reviews = await Review.find({ gameId }).populate('userId', 'username');
  res.json(reviews);
};

exports.addReview = async (req, res) => {
  const { gameId } = req.params;
  const { rating, comment } = req.body;

  try {
    const review = await Review.create({
      gameId,
      userId: req.user.id,
      rating,
      comment
    });
    res.status(201).json(review);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Hai già recensito questo gioco' });
    }
    console.error(err);
    res.status(500).json({ error: 'Errore nella creazione della recensione' });
  }
};

exports.deleteReview = async (req, res) => {
  const { id } = req.params;
  await Review.findByIdAndDelete(id);
  res.status(204).end();
};

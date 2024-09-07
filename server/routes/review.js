const express = require("express");
const router = express.Router();
const reviewController = require('../controllers/reviewController');

router.post('/addReview', reviewController.addReview);
router.get('/:listingId', reviewController.getReviewsByListing);
router.get('/averageRating/:listingId', reviewController.getAverageRatingByListing);
router.delete('/:reviewId', reviewController.deleteReview);

module.exports = router;
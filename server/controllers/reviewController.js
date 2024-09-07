const Review = require('../models/Review');
const Booking = require('../models/Booking');

exports.addReview = async (req, res) => {
    const { listingId, userId, rating, comment } = req.body;

    try {
        const currentDate = new Date();
        const query = {
            listingId,
            customerId: userId,
            status: { $ne: 'cancelled' },
            endDate: { $lt: currentDate }
        };

        const validBooking = await Booking.findOne(query);

        if (!validBooking) {
            return res.status(403)
        }

        const newReview = new Review({ listingId, userId, rating, comment });
        const savedReview = await newReview.save();
        res.status(201).json(savedReview);
    } catch (error) {
        res.status(500)
    }
};


exports.getReviewsByListing = async (req, res) => {
    const { listingId } = req.params;

    try {
        const reviews = await Review.find({ listingId }).populate('userId', 'firstName lastName');
        res.status(200).json(reviews);
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: "Error fetching reviews: " + error.message });
    }
};


exports.getAverageRatingByListing = async (req, res) => {
    const { listingId } = req.params;

    try {
        const reviews = await Review.find({ listingId });

        if (reviews.length === 0) {
            return res.status(200).json({ averageRating: 0, reviewCount: 0 });
        }

        const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
        const averageRating = (totalRating / reviews.length).toFixed(1);

        res.status(200).json({ averageRating, reviewCount: reviews.length });
    } catch (error) {
        console.error('Error fetching average rating:', error);
        res.status(500).json({ message: "Error fetching average rating: " + error.message });
    }
};

exports.deleteReview = async (req, res) => {
    const { reviewId } = req.params;

    try {
        const deletedReview = await Review.findByIdAndDelete(reviewId);
        if (!deletedReview) {
            return res.status(404).json({ message: "Recenzie negăsită" });
        }
        res.status(200).json({ message: "Recenzie ștersă cu succes." });
    } catch (error) {
        res.status(500)
    }
};



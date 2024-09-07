const router = require("express").Router();
const {
    getTrips,
    addListingToWishlist,
    getProperties,
    getReservations
} = require('../controllers/userController');

router.get("/:userId/trips", getTrips);
router.patch("/:userId/:listingId", addListingToWishlist);
router.get("/:userId/properties", getProperties);
router.get("/:userId/reservations", getReservations);

module.exports = router;

const express = require("express");
const router = express.Router();
const bookingController = require('../controllers/bookingController');

router.post("/create", bookingController.createBooking);
router.get("/occupied-dates/:listingId", bookingController.getOccupiedDates);

router.post("/mark-completed/:bookingId", bookingController.markBookingCompleted);
router.post("/create-checkout-session", bookingController.createCheckoutSession);
router.post("/mark-cancelled/:bookingId", bookingController.markBookingCancelled);
router.post("/complete-and-notify/:bookingId", bookingController.completeAndNotify);

module.exports = router;

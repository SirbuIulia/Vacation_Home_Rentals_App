const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");
const sendBookingConfirmation = require('../utils/sendEmailConfirmation');


exports.getBookingWithListingDetails = async (bookingId) => {
    const booking = await Booking.findById(bookingId).populate('listingId');
    if (!booking) {
        throw new Error('Booking not found');
    }
    return booking;
};

exports.createBooking = async (req, res) => {
    console.log("Received booking creation request:", req.body);
    const {
        customerId,
        hostId,
        listingId,
        startDate,
        endDate,
        totalPrice,
    } = req.body;

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        const existingBookings = await Booking.find({
            listingId,
            status: { $ne: 'cancelled' },
            $or: [{ startDate: { $lte: new Date(endDate) }, endDate: { $gte: new Date(startDate) } }]
        });

        if (existingBookings.length > 0) {
            return res.status(400)
        }

        const newBooking = new Booking({
            customerId,
            hostId,
            listingId,
            startDate: new Date(req.body.startDate),
            endDate: new Date(req.body.endDate),
            totalPrice,
            status: 'pending'
        });
        await newBooking.save();
        console.log("New booking created with ID:", newBooking._id);

        res.status(201).json({ bookingId: newBooking._id.toString() });
    } catch (err) {
        res.status(500)
    }
};


exports.createCheckoutSession = async (req, res) => {
    const { totalPrice, bookingId, stripeEmail } = req.body;
    if (!bookingId || !totalPrice) {
        return res.status(400).json({ error: "Missing booking ID" });
    }
    try {
        const booking = await Booking.findById(bookingId);
        if (!booking) {
            throw new Error('Booking not found');
        }
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: 'ron',
                    product_data: {
                        name: 'Rezervare casă de vacanță',
                    },
                    unit_amount: Math.round(totalPrice * 100),
                },
                quantity: 1,
            }],
            customer_email: stripeEmail,
            metadata: {
                bookingId: booking._id.toString()
            },
            mode: 'payment',
            success_url: `${req.headers.origin}/success/${bookingId}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${req.headers.origin}/cancel/${bookingId}`,
        });
        booking.stripeEmail = stripeEmail;
        await booking.save();
        res.status(200).json({ sessionId: session.id });
    } catch (err) {
        console.error("Stripe session creation failed:", err.message);
        res.status(500).json({ error: err.message });
    }
};

exports.getOccupiedDates = async (req, res) => {
    const { listingId } = req.params;

    try {
        const bookings = await Booking.find({
            listingId,
            status: { $ne: 'cancelled' }
        }, 'startDate endDate -_id');

        res.status(200).json(bookings.map(booking => ({
            startDate: booking.startDate,
            endDate: booking.endDate
        })));
    } catch (err) {
        res.status(500).json({ message: "Eroare la obținerea datelor ocupate.", error: err.message });
    }
};

exports.markBookingCompleted = async (req, res) => {
    const { bookingId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ error: "Invalid booking ID." });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(
            bookingId,
            { status: 'completed' },
            { new: true }
        );

        if (!updatedBooking) {
            return res.status(404).send({ error: 'Booking not found' });
        }

        console.log(`Booking ${bookingId} completed`);
        return res.status(200).json({ message: 'Booking marked as completed', booking: updatedBooking });
    } catch (error) {
        console.error('Error marking booking as completed:', error);
        return res.status(500).json({ message: 'Failed to mark booking as completed', error: error.message });
    }
};

exports.markBookingCancelled = async (req, res) => {
    const { bookingId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(bookingId)) {
        return res.status(400).json({ error: "Invalid booking ID." });
    }

    try {
        const updatedBooking = await Booking.findByIdAndUpdate(bookingId, { status: 'cancelled' }, { new: true });
        if (!updatedBooking) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ message: 'Booking cancelled successfully', booking: updatedBooking });
    } catch (error) {
        console.error('Error cancelling booking:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.completeAndNotify = async (req, res) => {
    const { bookingId } = req.params;
    const session_id = req.query.session_id;

    if (!session_id) {
        return res.status(400).json({ message: "Session ID is required" });
    }

    try {
        const session = await stripe.checkout.sessions.retrieve(session_id);
        if (!session.customer_details || !session.customer_details.email) {
            return res.status(400).json({ message: "Customer email not found in session details" });
        }

        const customerEmail = session.customer_details.email;

        const booking = await Booking.findById(bookingId).populate('listingId');
        if (!booking) {
            return res.status(404).json({ message: "Booking not found." });
        }

        if (booking.emailSent) {
            return res.status(200).json({ message: "Email already sent for this booking." });
        }

        booking.status = 'completed';
        booking.emailSent = true;
        await booking.save();

        try {
            await sendBookingConfirmation(customerEmail, booking);
            console.log('Booking completed and email sent successfully.');
            return res.status(200).json({ message: "Booking completed and email sent successfully." });
        } catch (error) {
            console.error('Failed to send booking confirmation email:', error);
            booking.emailSent = false;
            await booking.save();
            return res.status(500).json({ message: "Error sending email", error: error.message });
        }
    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    hostId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    listingId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Listing'
    },
    startDate: {
        type: Date,
        required: true,
    },
    endDate: {
        type: Date,
        required: true,
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, "Total price must be a positive number."]
    },
    stripeEmail: {
        type: String,
        required: false,
    },
    emailSent: {
        type: Boolean,
        default: false
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'cancelled'],
        default: 'pending'
    }
}, { timestamps: true });

const Booking = mongoose.model("Booking", BookingSchema);
module.exports = Booking;



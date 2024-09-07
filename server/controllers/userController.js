const Booking = require("../models/Booking");
const User = require("../models/User");
const Listing = require("../models/Listing");
const mongoose = require('mongoose');


exports.getTrips = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        const trips = await Booking.find({ customerId: userId, status: 'completed' }).populate("customerId hostId listingId");
        res.status(202).json(trips);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Can not find trips!", error: err.message });
    }
}

exports.addListingToWishlist = async (req, res) => {
    try {
        const { userId, listingId } = req.params;
        console.log("Received userId:", userId);
        console.log("Received listingId:", listingId);

        if (!mongoose.Types.ObjectId.isValid(userId) || !mongoose.Types.ObjectId.isValid(listingId)) {
            return res.status(400)
        }
        const user = await User.findById(userId);
        const listing = await Listing.findById(listingId).populate("creator");

        const favoriteListing = user.wishList.find((item) => item._id.toString() === listingId);

        if (favoriteListing) {
            user.wishList = user.wishList.filter((item) => item._id.toString() !== listingId);
            await user.save();
            res.status(200).json({ message: "Listing is removed from wish list", wishList: user.wishList });
        } else {
            user.wishList.push(listing);
            await user.save();
            res.status(200).json({ message: "Listing is added to wish list", wishList: user.wishList });
        }
    } catch (err) {
        console.log(err);
        res.status(404).json({ error: err.message });
    }
}

exports.getProperties = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        const properties = await Listing.find({ creator: userId }).populate("creator");
        res.status(202).json(properties);
    } catch (err) {
        console.log(err);
        res.status(404).json({ message: "Can not find properties!", error: err.message });
    }
}

exports.getReservations = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required.' });
        }
        const reservations = await Booking.find({ hostId: userId })
            .populate({
                path: "customerId",
                select: "firstName lastName"
            })
            .populate({
                path: "listingId",
                select: "title city province country category listingPhotoPaths"
            })
            .sort({ startDate: -1 });

        res.status(202).json(reservations.map(reservation => ({
            ...reservation._doc,
            customerFirstName: reservation.customerId.firstName,
            customerLastName: reservation.customerId.lastName,
        })));
    } catch (err) {
        console.error("Cannot find reservations:", err);
        res.status(404).json({ message: "Can not find reservations!", error: err.message });
    }
}



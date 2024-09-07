const Listing = require("../models/Listing");

exports.createListing = async (req, res) => {
    try {
        const data = req.body;
        const listingPhotos = req.files;
        if (!listingPhotos) {
            return res.status(400).send("No file uploaded.");
        }

        data.listingPhotoPaths = listingPhotos.map((file) => file.path);

        if (typeof data.amenities === 'string') {
            data.amenities = data.amenities.split(',').map(item => item.trim());
        }

        const newListing = new Listing(data);
        await newListing.save();
        res.status(200).json(newListing);
    } catch (err) {
        res.status(409).json({ message: "Fail to create Listing", error: err.message });
    }
};

exports.getListingsByCategory = async (req, res) => {
    const qCategory = req.query.category;
    try {
        let listings = qCategory && qCategory !== "Toate"
            ? await Listing.find({ category: qCategory }).populate("creator")
            : await Listing.find().populate("creator");
        res.status(200).json(listings);
    } catch (err) {
        res.status(404).json({ message: "Fail to fetch listings", error: err.message });
    }
};


exports.getListingsBySearch = async (req, res) => {
    const { search } = req.params;
    try {
        let listings = search === "all" ? await Listing.find().populate("creator") : await Listing.find({
            $or: [
                { category: { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } },
                { city: { $regex: search, $options: "i" } },
                { province: { $regex: search, $options: "i" } }
            ]
        }).populate("creator");
        res.status(200).json(listings);
    } catch (err) {
        res.status(404).json({ message: "Fail to fetch listings", error: err.message });
    }
};

exports.getListingDetails = async (req, res) => {
    const { listingId } = req.params;
    try {
        const listing = await Listing.findById(listingId).populate("creator");
        if (!listing) {
            return res.status(404).json({ message: "Listing not found!" });
        }
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch listing details", error: err.message });
    }
};


exports.editListing = async (req, res) => {
    const { listingId } = req.params;
    const updates = req.body;
    const newPhotos = req.files ? req.files.map(file => file.path) : [];
    const photosToRemove = JSON.parse(updates.photosToRemove || '[]');

    try {
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        listing.listingPhotoPaths = listing.listingPhotoPaths.filter(photo => !photosToRemove.includes(photo));
        if (newPhotos.length) {
            listing.listingPhotoPaths = [...listing.listingPhotoPaths, ...newPhotos];
        }
        if (typeof updates.amenities === 'string') {
            updates.amenities = updates.amenities.split(',').map(item => item.trim());
        }
        updates.amenities = [...new Set(updates.amenities)];
        Object.keys(updates).forEach((key) => {
            if (key !== "existingPhotos" && key !== "photosToRemove") {
                listing[key] = updates[key];
            }
        });
        await listing.save();
        res.status(200).json(listing);
    } catch (err) {
        res.status(500).json({ message: "Failed to update listing", error: err.message });
    }
};



exports.deleteListing = async (req, res) => {
    const { listingId } = req.params;
    try {
        const listing = await Listing.findByIdAndDelete(listingId);
        if (!listing) {
            return res.status(404).json({ message: "Listing not found" });
        }
        res.status(200).json({ message: "Listing deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Failed to delete listing", error: err.message });
    }
};



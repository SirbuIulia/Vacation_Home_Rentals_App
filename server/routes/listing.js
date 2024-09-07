const express = require('express');
const router = express.Router();
const listingController = require('../controllers/listingController');

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (_req, _file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (_req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router.post("/create", upload.array("listingPhotos"), listingController.createListing);
router.get("/", listingController.getListingsByCategory);
router.get("/search/:search", listingController.getListingsBySearch);
router.get("/:listingId", listingController.getListingDetails);
router.put("/:listingId", upload.array("listingPhotos"), listingController.editListing);
router.delete("/delete/:listingId", listingController.deleteListing);

module.exports = router;

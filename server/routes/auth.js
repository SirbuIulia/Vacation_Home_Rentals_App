const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const multer = require('multer');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "public/uploads/");
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    },
});
const upload = multer({ storage });

router.post('/register', upload.single('profileImage'), authController.register);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/verify-code', authController.verifyCode);
router.post('/google-login', authController.handleGoogleLogin);

module.exports = router;

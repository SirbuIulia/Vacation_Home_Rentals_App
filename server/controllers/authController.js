const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmailReset');

exports.register = async (req, res) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        if (!password) {
            return res.status(400).send('Password is required for registration.');
        }
        if (!req.file) {
            return res.status(400).send('Profile image file is required.');
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists!');
        }

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({
            method: 'local',
            firstName,
            lastName,
            email,
            password: hashedPassword,
            profileImagePath: req.file.path
        });

        await newUser.save();
        res.status(201).send('User registered successfully!');
    } catch (err) {
        res.status(500).send('Server error during registration: ' + err.message);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).populate('wishList');
        if (!user) {
            return res.status(409).json({ message: "User doesn't exist!" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid Credentials!" });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30m' });

        res.status(200).json({ user: createUserObject(user), token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

function createUserObject(user) {
    return {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        profileImagePath: user.profileImagePath,
        method: user.method,
        wishList: user.wishList
    };
}

exports.handleGoogleLogin = async (req, res) => {
    const { email, name, googleId, picture } = req.body;

    console.log("Received Google login request:", { email, name, googleId, picture });

    try {
        console.log("Checking if user already exists in the database...");
        let user = await User.findOne({ email });

        if (!user) {
            console.log("No existing user found, creating new user...");
            user = new User({
                method: 'google',
                firstName: name,
                lastName: '',
                email,
                googleId,
                profileImagePath: picture
            });
            await user.save();
            console.log("User details updated:", user._id);
        } else {
            console.log('Existing Google user ID:', user._id);
        }

        console.log("Generating JWT token...");
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);


        res.status(200).json({ user: createUserObject(user), token });
        console.log("Sending response back to client...");
    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({ message: "Server error", error });
    }
};


exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(404).send({ message: 'User does not exist.' });
    }

    try {

        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        const codeExpiry = Date.now() + 3600000;
        user.verificationCode = verificationCode;
        user.codeExpiry = codeExpiry;
        await user.save();
        await sendEmail(email, 'Resetare parolă', verificationCode);
        res.send({ message: 'Verification code has been sent to your email.' });
    } catch (error) {
        console.error('Failed to send verification code:', error);
        res.status(500).send({ message: 'Failed to send verification code.', error });
    }
};

exports.verifyCode = async (req, res) => {
    const { email, code } = req.body;

    if (!email || !code) {
        return res.status(400).send({ message: 'Email and code must be provided.' });
    }

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(404).send({ message: 'User not found.' });
    }

    if (user.verificationCode === code && new Date() < new Date(user.codeExpiry)) {
        const tempToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        res.send({ message: 'Code verified successfully.', token: tempToken });
    } else {
        return res.status(400).send({ message: 'Invalid or expired code.' });
    }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = await User.findByIdAndUpdate(decoded.id, { password: hashedPassword }, { new: true });
        if (!user) {
            throw new Error('User not found.');
        }
        res.send({ message: 'Parola a fost resetată cu succes!' });
    } catch (error) {
        res.status(400).send({ message: 'Link invalid sau expirat!' });
    }
};

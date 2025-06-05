const express = require('express');
const router = express.Router();
const { registerUser, loginUser, verifyGoogleToken } = require('../controllers/authController');
const { sendOTP, verifyOTP } = require('../controllers/otpController');

router.post('/register', registerUser);
router.post('/login', loginUser);
// Route to handle Google Sign-In token verification
router.post('/google-login', verifyGoogleToken);

// OTP Routes
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);

module.exports = router;

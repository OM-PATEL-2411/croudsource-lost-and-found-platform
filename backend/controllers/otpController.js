// controllers/otpController.js
const nodemailer = require('nodemailer');
const User = require('../models/user'); // Assuming User model is in the 'models' folder
const jwt = require('jsonwebtoken'); // Make sure this is imported at the top

// Function to generate a random OTP (6 digits)
const generateOTP = () => {
  let otp = '';
  for (let i = 0; i < 6; i++) {
    otp += Math.floor(Math.random() * 10);
  }
  return otp;
};

// Send OTP to user's email
const sendOTP = async (req, res) => {
  const { email } = req.body;

  try {
    // Log the email to verify it is the correct one
    // console.log('Sending OTP to:', email);

    // Check if the user exists in the database by email
    const user = await User.findOne({ email });
    if (!user) {
      console.log('User not found for email:', email);  // Debugging log
      return res.status(404).json({ message: 'User not found' });
    }

    // Log user details to confirm correct user data is fetched
    // console.log('User found:', user);

    // Generate OTP and log it to check if it's being generated correctly
    const otp = generateOTP();
    // console.log('Generated OTP:', otp);  // Debugging line

    // Set OTP expiry (5 minutes)
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes from now

    // Update OTP in the database
    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Log the updated user data to confirm OTP is saved
    // console.log('User updated with OTP:', user);

    // Nodemailer setup
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
      },
    });

    // Sending OTP email
    const mailOptions = {
      from: process.env.EMAIL_USER, // This is the email from which the OTP will be sent
      to: user.email, // The user's email address
      subject: 'Your One-Time Password (OTP) for Login',
      text:`Hello ${user.name},\n\nYour OTP for login is: ${otp}\n\nThis OTP is valid for 5 minutes.\n\nThanks,\nLost & Found Team`, // OTP content
    };

    // Send OTP email
    transporter.sendMail(mailOptions, (err, info) => {
      if (err) {
        console.log('Failed to send OTP:', err); // Log error if email sending fails
        return res.status(500).json({ message: 'Failed to send OTP', error: err.message });
      }
      // console.log('OTP sent successfully:', info); // Log success info for OTP
      res.status(200).json({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Error during OTP send:', error);
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};


// Verify OTP entered by the user
const verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    // Check if OTP is valid and not expired
    if (user.otp !== otp) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    if (user.otpExpiry < Date.now()) {
      return res.status(400).json({ message: 'OTP has expired' });
    }
         // OTP is valid, now generate a JWT token
    const payload = {
      userId: user._id,
      email: user.email,
      name: user.name || 'User',
    };

    const secretKey = process.env.JWT_SECRET; // Ensure you have this secret in your .env file
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expires in 1 hour

    // Send the token back in the response
    res.status(200).json({
      message: 'OTP verified successfully',
      token: token,
    });

  } catch (error) {
    res.status(500).json({ message: 'Something went wrong', error: error.message });
  }
};

module.exports = { sendOTP, verifyOTP };

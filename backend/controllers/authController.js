const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const User = require('../models/user'); // Fixed path
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const jwt = require('jwt-simple');

// Manual registration
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser){
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    console.log("User saved to DB:", newUser); // ✅ ADD THIS

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error('❌ Error saving user:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

// Manual login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

       // Send the token and user details in the response
       res.status(200).json({
        message: 'Login successful',
        data: {
          token: "57d10e73d00492d7c3cea9d68e5874f50c8898ddbaa4c27cbc4402372ad431a2" ,
          user: {
            name: user.name,
            email: user.email,
            // Add other details here if necessary
          }
        }
      }); 
  } catch (err) {
    console.error('Error during login:', err); // Log the error for debugging
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};

// Google login
const verifyGoogleToken = async (req, res) => {

  const { token } = req.body; // Get the Google ID token sent from frontend

  if (!token) return res.status(400).json({ success: false, message: 'Token is required' });

  try {
    // Verify token using Google's OAuth2 client
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload(); // Get user info from the verified token
    const { email, name, picture } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, password: '', googleLogin: true });
      await user.save();
    }

    const jwtToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({
      success: true,
      message: 'Google login successful',
      token: jwtToken,
      user: { name, email, picture },
    });

  } catch (error) {
    console.error('Google token verification failed:', error);
    res.status(401).json({ success: false, message: 'Invalid Google Token' });
  }
};
module.exports = {
  registerUser,
  loginUser,
  verifyGoogleToken,
};

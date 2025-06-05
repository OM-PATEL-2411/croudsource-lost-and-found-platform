// models/user.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: function() { return !this.googleLogin; } // required only if NOT google login
  },
  googleLogin: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  }, 
});

module.exports = mongoose.model('User', userSchema);

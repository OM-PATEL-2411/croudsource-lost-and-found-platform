// models/FoundItem.js
const mongoose = require('mongoose');

const FoundItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: 'Found',
  },
  email: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String, // Cloudinary URL
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('FoundItem', FoundItemSchema);

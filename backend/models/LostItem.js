// models/LostItem.js
const mongoose = require('mongoose');

const LostItemSchema = new mongoose.Schema({
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
    default: 'lost',
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

module.exports = mongoose.model('LostItem', LostItemSchema);

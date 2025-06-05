// cloudinaryConfig.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dwoagvkcz',  // Replace with your Cloudinary Cloud Name
  api_key: '176278783122175',       // Replace with your Cloudinary API Key
  api_secret: 'e9UexZpnMbYnyTsrgcXf77OdLBQ'  // Replace with your Cloudinary API Secret
});

module.exports = cloudinary;

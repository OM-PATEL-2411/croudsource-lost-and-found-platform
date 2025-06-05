// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const upload = require('../middleware/multerMiddleware');  // Ensure this exports multer correctly
const { uploadLostImage } = require('../controllers/uploadLostController');

// Ensure field name in .single('image') matches frontend & Postman key exactly
router.post('/upload-item', upload.single('image'), uploadLostImage);

module.exports = router;
// routes/itemRoutes.js

const express = require('express');
const Item = require('../models/Item');
const router = express.Router();

// Endpoint to get all items sorted by creation date (newest first)
router.get('/items', async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });  // Sort by createdAt (newest first)
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

module.exports = router;

const express = require('express');
const router = express.Router();
const LostItem = require('../models/LostItem'); // Adjust path if needed

// Get all lost items
router.get('/view', async (req, res) => {
  try {
    const items = await LostItem.find().sort({ createdAt: -1 });  // Sort by createdAt (newest first)
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching items', error: error.message });
  }
});

// Get lost item by ID
router.get('/itemDetails/:id', async (req, res) => {
  const id = req.params.id;  // Correctly capture the itemId
  try {
    const item = await LostItem.findById(id);
    if (!item) return res.status(404).json({ error: 'Item not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch item' });
  }
});

module.exports = router;

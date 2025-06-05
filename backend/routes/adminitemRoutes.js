// routes/adminitemRoutes.js

const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Make sure Item model path is correct

// GET all items
router.get('/', async (req, res) => {
  try {
    const items = await Item.find(); // Fetch all items
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch items', error });
  }
});

// Delete an item by id
router.delete('/:id', async (req, res) => {
    try {
      const item = await Item.findByIdAndDelete(req.params.id);
  
      if (!item) {
        return res.status(404).json({ message: 'Item not found' });
      }
  
      res.json({ message: 'Item deleted successfully', item });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;

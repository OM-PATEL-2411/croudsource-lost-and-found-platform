// In your routes/items.js or routes/itemRoutes.js (depending on your project structure)

const express = require('express');
const router = express.Router();
const Item = require('../models/Item'); // Adjust the path as per your folder structure

// Route to get item details by ID
router.get('/itemDetails/:id', async (req, res) => {
  try {
    const itemDetails = await Item.findById(req.params.id); // Fetch item by ID from the database
    if (!itemDetails) {
      return res.status(404).json({ message: 'Item not found' }); // If no item found, send a 404 error
    }
    res.json(itemDetails); // Return item data as JSON
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' }); // Handle server errors
  }
});

module.exports = router;

// scripts/mergeItems.js

require('dotenv').config();
const mongoose = require('mongoose');
const LostItem = require('../models/LostItem');
const FoundItem = require('../models/FoundItem');
const Item = require('../models/Item'); // New unified model

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB'))
.catch(err => console.error('❌ DB connection error:', err));

const mergeData = async () => {
  try {
    const lostItems = await LostItem.find({});
    const foundItems = await FoundItem.find({});

    const formattedLost = lostItems.map(item => ({
      name: item.name,
      description: item.description,
      location: item.location,
      imageUrl: item.imageUrl,
      status: 'Lost',
      email: item.email,
      mobile: item.mobile,
      createdAt: item.createdAt
    }));

    const formattedFound = foundItems.map(item => ({
      name: item.name,
      description: item.description,
      location: item.location,
      imageUrl: item.imageUrl,
      status: 'Found',
      email: item.email,
      mobile: item.mobile,
      createdAt: item.createdAt
    }));

    const combinedItems = [...formattedLost, ...formattedFound];

    await Item.insertMany(combinedItems);
    console.log('✅ Successfully merged data into Item collection');
  } catch (err) {
    console.error('❌ Merge failed:', err.message);
  } finally {
    mongoose.connection.close();
  }
};

mergeData();

// server.js

require('dotenv').config(); // ✅ Load environment variables at the very top

const express = require('express');
const connectDB = require('./config/db');
const LostitemRoutes = require('./routes/LostitemRoutes');
const FounditemRoutes = require('./routes/FounditemRoutes');
const authRoutes = require('./routes/authRoutes');
const itemRoutes = require('./routes/itemRoutes'); // correct path
const itemDetailsRoutes = require('./routes/ItemDetailsRoutes'); 
const lostitemviewroutes=require('./routes/lostItemsViewRoutes');
const Founditemviewroutes=require('./routes/foundItemsViewRoutes');
const adminRoutes = require('./routes/AdminRoutes');
const adminuserRoutes = require('./routes/adminuserRoutes');
const adminitemRoutes = require('./routes/adminitemRoutes');
const cors = require('cors');

// ✅ Check if Mongo URI is loaded correctly
console.log('Mongo URI:', process.env.MONGODB_URI);

const app = express();
app.use(express.urlencoded({ extended: true }));
const PORT = process.env.PORT || 5000;

// Set COOP and other necessary headers
app.use((req, res, next) => {
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  next();
});

app.use(express.json()); // Parses JSON requests

app.use(cors({
  origin: '*', // Optional: Replace with frontend domain
  credentials: true
}));

// Connect to MongoDB
connectDB();

// API Routes
app.use('/api/Found', FounditemRoutes);
app.use('/api/Lost', LostitemRoutes);
app.use('/api/auth', authRoutes);
app.use('/routes', itemRoutes); // mounts it at /routes
app.use('/routes', itemDetailsRoutes);
app.use('/lostitems', lostitemviewroutes);
app.use('/founditems', Founditemviewroutes);
app.use('/admin', adminRoutes);
app.use('/api/users', adminuserRoutes);
app.use('/api/items', adminitemRoutes);


// Test route
app.get('/', (req, res) => {
  res.send('Crowdsource Lost & Found Platform Backend is Running 🚀');
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server started on port ${PORT}`);
});

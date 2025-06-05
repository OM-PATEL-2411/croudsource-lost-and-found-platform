// server/createAdmin.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Admin = require('./models/admin');
const connectDB = require('./config/db');

const createAdmin = async () => {
  await connectDB();

  const email = 'ompatel6351@gmail.com';
  const password = 'om@24/11';

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = new Admin({ email, password: hashedPassword });

  await admin.save();
  console.log('Admin created successfully');
  process.exit();
};

createAdmin();

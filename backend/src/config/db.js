const mongoose = require('mongoose');

const connectDB = async () => {
  console.log('DEBUG: MONGO_URI =', process.env.MONGO_URI); // <--- debug line

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('DB connection failed', error.message);
    process.exit(1);
  }
};

module.exports = connectDB;


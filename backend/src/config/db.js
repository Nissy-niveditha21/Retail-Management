const mongoose = require('mongoose');

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
  console.log('DEBUG: MONGO_URI =', mongoUri);

  try {
    if (!mongoUri) {
      throw new Error('MONGODB_URI environment variable is not set');
    }
    await mongoose.connect(mongoUri);
    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    console.error('❌ DB connection failed:', error.message);
    // Don't exit on connection failure for development
    console.warn('⚠️  Continuing without database connection...');
  }
};

module.exports = connectDB;


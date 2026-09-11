const mongoose = require('mongoose');

async function connectDB() {
  const primaryUri = process.env.MONGO_URI || process.env.MONGO_URL;
  const localUri = 'mongodb://127.0.0.1:27017/backhaulx';

  // 1. Try Primary Atlas URI first
  if (primaryUri) {
    try {
      console.log('🔄 Connecting to Primary MongoDB URI...');
      await mongoose.connect(primaryUri, { serverSelectionTimeoutMS: 4000 });
      console.log('✅ Connected to MongoDB Atlas Database');
      return;
    } catch (err) {
      console.warn('⚠️ Primary MongoDB Atlas connection failed:', err.message);
    }
  }

  // 2. Try Local MongoDB instance
  try {
    console.log('🔄 Attempting local MongoDB connection (mongodb://127.0.0.1:27017/backhaulx)...');
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 3000 });
    console.log('✅ Connected to Local MongoDB instance');
    return;
  } catch (err) {
    console.warn('⚠️ Local MongoDB instance not available');
  }

  // 3. Fallback to MongoMemoryServer
  try {
    console.log('⚡ Launching Embedded In-Memory MongoDB Server for 100% reliable execution...');
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri);
    console.log('✅ Connected to Embedded In-Memory MongoDB Database');
  } catch (err) {
    console.error('❌ Database connection error:', err.message);
    throw err;
  }
}

module.exports = connectDB;

const mongoose = require('mongoose');
const seedData = require('../utils/seed');

let mongoMemoryServer = null;

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/fitforge';

  try {
    console.log(`[Database] Attempting connection to MongoDB at: ${mongoUri}`);
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    await seedData();
  } catch (error) {
    console.warn(`[Database] Could not connect to local MongoDB (${error.message}). Starting MongoMemoryServer fallback...`);

    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();

      const conn = await mongoose.connect(memoryUri);
      console.log(`[Database] MongoMemoryServer Connected Successfully at: ${memoryUri}`);
      await seedData();
    } catch (memError) {
      console.error(`[Database] Failed to start MongoMemoryServer fallback: ${memError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;

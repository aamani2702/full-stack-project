const mongoose = require('mongoose');

// Connects to MONGODB_URI (Atlas / local). If none is set, spins up an in-memory
// MongoDB so the project runs with zero setup during development.
async function connectDB() {
  let uri = process.env.MONGODB_URI;
  let inMemory = false;
  if (!uri) {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mem = await MongoMemoryServer.create();
    uri = mem.getUri('bloom');
    inMemory = true;
    console.log('i  No MONGODB_URI set - using in-memory MongoDB (data resets on restart).');
  }
  await mongoose.connect(uri);
  console.log('MongoDB connected');
  return { inMemory };
}

module.exports = connectDB;

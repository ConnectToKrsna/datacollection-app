import mongoose from 'mongoose';

const MONGODB_URI = "mongodb+srv://connecttokrishnanow:connectkrishna@cluster0.klv9jyb.mongodb.net/dataCollection"

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI correctly');
}

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

export default dbConnect;

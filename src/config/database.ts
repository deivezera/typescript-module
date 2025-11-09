import mongoose from 'mongoose';

/**
 * Connect to MongoDB database
 */
export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.DATABASE_URL;
  if (!mongoUri) {
    throw new Error('DATABASE_URL is not set');
  }
  try {
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB successfully');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * Disconnect from MongoDB database
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
  } catch (error) {
    console.error('❌ MongoDB disconnection error:', error);
  }
}


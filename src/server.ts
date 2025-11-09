import dotenv from 'dotenv';

dotenv.config();

import app from './app';
import { connectDatabase } from './config/database';

const PORT = process.env.PORT || 3000;

/**
 * Start the server
 */
async function startServer(): Promise<void> {
  try {

    await connectDatabase();

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
      console.log(`📝 API endpoints:`);
      console.log(`   POST   /api/auth/register - Register a new user`);
      console.log(`   POST   /api/auth/login - Login a user`);
      console.log(`   GET    /api/auth/me - Get current user (requires auth)`);
      console.log(`   GET    /health - Health check`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGTERM', async () => {
  console.log('SIGTERM received, shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database');
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT received, shutting down gracefully...');
  const { disconnectDatabase } = await import('./config/database');
  await disconnectDatabase();
  process.exit(0);
});


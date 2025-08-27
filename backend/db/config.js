import { prisma } from '../lib/prisma.js';

// Test database connection
async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Successfully connected to Neon PostgreSQL database!');
  } catch (error) {
    console.error('Error connecting to database:', error);
    process.exit(1);
  }
}

// Initialize connection
testConnection();

export default prisma;
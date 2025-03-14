// Load environment variables from .env file
require('dotenv').config();

// Configuration for environment variables
module.exports = {
  // MongoDB connection string
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb+srv://manji:manji@cluster0.dcblk.mongodb.net/',
  
  // JWT Secret for authentication
  JWT_SECRET: process.env.JWT_SECRET || 'e4d9a7b2c1f8e3d6a9b2c5f8e7d0a3b6',
  
  // Port for the server
  PORT: process.env.PORT || 3000,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'production'
}; 
/**
 * Main Express application
 */
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const path = require('path');

console.log('===== APPLICATION STARTUP =====');
console.log('Node version:', process.version);
console.log('Current directory:', __dirname);
console.log('Environment variables:', {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  MONGODB_URI: process.env.MONGODB_URI ? 'Set (value hidden)' : 'Not set'
});

const { localeMiddleware } = require('./middleware/localeMiddleware');
const { handleErrors, handle404, handleValidationErrors } = require('./middleware/errorMiddleware');

try {
  console.log('Loading environment variables');
  dotenv.config();
  console.log('Environment variables loaded successfully');
} catch (error) {
  console.error('Error loading environment variables:', error);
}

try {
  console.log('Loading route modules');
  const authRoutes = require('./routes/authRoutes');
  const profileRoutes = require('./routes/profileRoutes');
  const profileSettingsRoutes = require('./routes/settings/profileSettingsRoutes');
  const expressEntryRoutes = require('./routes/canada/expressEntryRoutes');
  const assessmentRoutes = require('./routes/assessment/assessmentRoutes');
  const pathwayRoutes = require('./routes/pathway/pathwayRoutes');
  const formRoutes = require('./routes/forms/formRoutes');
  const consultantRoutes = require('./routes/consultant/consultantRoutes');
  const bookingRoutes = require('./routes/consultant/bookingRoutes');
  const consultantDashboardRoutes = require('./routes/consultant/consultantDashboardRoutes');
  const adminSettingsRoutes = require('./routes/admin/adminSettingsRoutes');
  console.log('Route modules loaded successfully');

  console.log('Creating Express application');
  const app = express();
  console.log('Express application created');

  console.log('Connecting to MongoDB...');
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward';
  console.log('MongoDB URI:', mongoUri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
  
  mongoose.connect(mongoUri)
    .then(() => {
      console.log('Connected to MongoDB successfully');
      
      console.log('Setting up middleware');
      app.use(helmet()); // Security headers
      app.use(cors()); // Enable CORS
      app.use(morgan('dev')); // Logging
      app.use(express.json()); // Parse JSON bodies
      app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
      app.use(localeMiddleware); // Set locale based on request
      console.log('Middleware setup complete');

      console.log('Setting up static file serving');
      app.use(express.static(path.join(__dirname, 'public')));
      app.use('/locales', express.static(path.join(__dirname, 'locales')));
      console.log('Static file serving setup complete');

      console.log('Setting up API routes');
      app.use('/api/auth', authRoutes);
      app.use('/api/profile', profileRoutes);
      app.use('/api/profile-settings', profileSettingsRoutes);
      app.use('/api/canada/express-entry', expressEntryRoutes);
      app.use('/api/assessment', assessmentRoutes);
      app.use('/api/pathway', pathwayRoutes);
      app.use('/api/forms', formRoutes);
      app.use('/api/consultants', consultantRoutes);
      app.use('/api/bookings', bookingRoutes);
      app.use('/api/consultant-dashboard', consultantDashboardRoutes);
      app.use('/api/admin', adminSettingsRoutes);
      console.log('API routes setup complete');

      console.log('Setting up health check endpoint');
      app.get('/health', (req, res) => {
        console.log('Health check endpoint called');
        res.status(200).json({ 
          status: 'ok',
          version: process.env.npm_package_version || '1.0.0',
          environment: process.env.NODE_ENV || 'development',
          mongodb: 'connected'
        });
        console.log('Health check response sent');
      });
      console.log('Health check endpoint setup complete');

      console.log('Setting up error handling middleware');
      app.use(handle404);
      app.use(handleValidationErrors);
      app.use(handleErrors);
      console.log('Error handling middleware setup complete');

      const PORT = process.env.PORT || 5000;
      console.log(`Starting server on port ${PORT}`);
      
      const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
        console.log('===== APPLICATION STARTUP COMPLETE =====');
      });
      
      server.on('error', (error) => {
        console.error('Server error:', error);
      });
      
    })
    .catch(err => {
      console.error('MongoDB connection error:', err);
      process.exit(1); // Exit with error code
    });

  module.exports = app;
  
} catch (error) {
  console.error('Fatal error during application startup:', error);
  process.exit(1); // Exit with error code
}

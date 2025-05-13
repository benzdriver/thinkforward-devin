/**
 * Mock Express app for testing
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const mongoose = require('mongoose');

const authRoutes = require('./routes/auth/authRoutes');
const profileRoutes = require('./routes/profile/profileRoutes');
const profileSettingsRoutes = require('./routes/settings/profileSettingsRoutes');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));

app.use((req, res, next) => {
  req.locale = req.headers['accept-language'] || 'en';
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/settings', profileSettingsRoutes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  res.status(statusCode).json({
    success: false,
    message
  });
});

module.exports = app;

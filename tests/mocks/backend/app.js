/**
 * Mock Express application for testing
 */
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/auth', (req, res, next) => {
  next();
});

app.use('/api/profile', (req, res, next) => {
  next();
});

app.use('/api/assessment', (req, res, next) => {
  next();
});

app.use('/api/pathway', (req, res, next) => {
  next();
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

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

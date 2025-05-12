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

const { localeMiddleware } = require('./middleware/localeMiddleware');
const { handleErrors, handle404, handleValidationErrors } = require('./middleware/errorMiddleware');

dotenv.config();

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

const app = express();

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

app.use(helmet()); // Security headers
app.use(cors()); // Enable CORS
app.use(morgan('dev')); // Logging
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies
app.use(localeMiddleware); // Set locale based on request

app.use(express.static(path.join(__dirname, 'public')));

app.use('/locales', express.static(path.join(__dirname, 'locales')));

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

app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'ok',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  });
});

app.use(handle404);

app.use(handleValidationErrors);

app.use(handleErrors);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
});

module.exports = app;

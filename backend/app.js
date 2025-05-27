/**
 * Main Express application
 */
console.log('===== APPLICATION STARTUP INITIATED =====');
console.log('Node version:', process.version);
console.log('Current directory:', __dirname);

const dotenv = require('dotenv');
try {
  console.log('Loading environment variables');
  dotenv.config();
  console.log('Environment variables loaded successfully');
  console.log('Environment variables:', {
    NODE_ENV: process.env.NODE_ENV,
    PORT: process.env.PORT,
    MONGODB_URI: process.env.MONGODB_URI ? 'Set (value hidden)' : 'Not set'
  });
} catch (error) {
  console.error('Error loading environment variables:', error);
}

const http = require('http');
const minimalServer = http.createServer((req, res) => {
  console.log(`Minimal server received request: ${req.method} ${req.url}`);
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok',
      version: process.env.npm_package_version || '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      minimal: true
    }));
    console.log('Minimal health check response sent');
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

const MINIMAL_PORT = process.env.PORT || 5000;
console.log(`Starting minimal server on port ${MINIMAL_PORT}`);
minimalServer.listen(MINIMAL_PORT, () => {
  console.log(`Minimal server running on port ${MINIMAL_PORT}`);
  console.log('Will start full application in 5 seconds...');
  
  setTimeout(() => {
    startFullApplication();
  }, 5000);
});

// Function to start the full application
function startFullApplication() {
  try {
    console.log('===== STARTING FULL APPLICATION =====');
    
    const express = require('express');
    const mongoose = require('mongoose');
    const cors = require('cors');
    const helmet = require('helmet');
    const morgan = require('morgan');
    const path = require('path');
    
    console.log('Core modules imported successfully');
    
    let localeMiddleware, handleErrors, handle404, handleValidationErrors;
    try {
      console.log('Importing middleware modules');
      const localeMiddlewareModule = require('./middleware/localeMiddleware');
      localeMiddleware = localeMiddlewareModule.localeMiddleware;
      
      const errorMiddlewareModule = require('./middleware/errorMiddleware');
      handleErrors = errorMiddlewareModule.handleErrors;
      handle404 = errorMiddlewareModule.handle404;
      handleValidationErrors = errorMiddlewareModule.handleValidationErrors;
      console.log('Middleware modules imported successfully');
    } catch (error) {
      console.error('Error importing middleware modules:', error);
      return; // Don't proceed if middleware can't be loaded
    }
    
    // Create Express application
    console.log('Creating Express application');
    const app = express();
    console.log('Express application created');
    
    console.log('Connecting to MongoDB...');
    let mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/thinkforward';
    
    if (mongoUri.includes('://:@')) {
      console.log('Detected empty credentials in MongoDB URI, fixing format');
      mongoUri = mongoUri.replace('://:', '://');
      mongoUri = mongoUri.replace(':@', '');
    }
    
    console.log('MongoDB URI:', mongoUri.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs
    
    mongoose.connect(mongoUri, { 
      serverSelectionTimeoutMS: 10000,
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
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
        
        console.log('Setting up health check endpoint');
        app.get('/health', (req, res) => {
          console.log('Health check endpoint called on full application');
          res.status(200).json({ 
            status: 'ok',
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            mongodb: 'connected',
            full: true
          });
          console.log('Health check response sent from full application');
        });
        console.log('Health check endpoint setup complete');
        
        console.log('Loading route modules');
        const routeModules = [
          { path: '/api/auth', module: './routes/authRoutes' },
          { path: '/api/profile', module: './routes/profileRoutes' },
          { path: '/api/profile-settings', module: './routes/settings/profileSettingsRoutes' },
          { path: '/api/canada/express-entry', module: './routes/canada/expressEntryRoutes' },
          { path: '/api/assessment', module: './routes/assessment/assessmentRoutes' },
          { path: '/api/pathway', module: './routes/pathway/pathwayRoutes' },
          { path: '/api/forms', module: './routes/forms/formRoutes' },
          { path: '/api/consultants', module: './routes/consultant/consultantRoutes' },
          { path: '/api/bookings', module: './routes/consultant/bookingRoutes' },
          { path: '/api/consultant-dashboard', module: './routes/consultant/consultantDashboardRoutes' },
          { path: '/api/admin', module: './routes/admin/adminSettingsRoutes' }
        ];
        
        routeModules.forEach(route => {
          try {
            console.log(`Loading route module: ${route.module}`);
            const routeModule = require(route.module);
            app.use(route.path, routeModule);
            console.log(`Route module ${route.module} loaded successfully`);
          } catch (error) {
            console.error(`Error loading route module ${route.module}:`, error);
          }
        });
        console.log('Route modules loading complete');
        
        console.log('Setting up error handling middleware');
        app.use(handle404);
        app.use(handleValidationErrors);
        app.use(handleErrors);
        console.log('Error handling middleware setup complete');
        
        const PORT = parseInt(process.env.PORT || '5000') + 1; // Use a different port than the minimal server
        console.log(`Starting full application server on port ${PORT}`);
        
        const server = app.listen(PORT, () => {
          console.log(`Full application server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
          console.log('===== FULL APPLICATION STARTUP COMPLETE =====');
          
          console.log('Closing minimal server...');
          minimalServer.close(() => {
            console.log('Minimal server closed');
            
            const MAIN_PORT = process.env.PORT || 5000;
            console.log(`Moving full application to main port ${MAIN_PORT}`);
            
            server.close(() => {
              app.listen(MAIN_PORT, () => {
                console.log(`Full application now running on main port ${MAIN_PORT}`);
              });
            });
          });
        });
        
        server.on('error', (error) => {
          console.error('Server error:', error);
        });
        
      })
      .catch(err => {
        console.error('MongoDB connection error:', err);
        console.log('Application will continue without MongoDB connection');
        
        setupMinimalApplicationWithoutMongoDB(app, localeMiddleware, handleErrors, handle404, handleValidationErrors);
      });
    
  } catch (error) {
    console.error('Fatal error during full application startup:', error);
  }
}

function setupMinimalApplicationWithoutMongoDB(app, localeMiddleware, handleErrors, handle404, handleValidationErrors) {
  try {
    console.log('Setting up minimal application without MongoDB');
    console.log('Using existing minimal server for health checks');
    
    app.use(helmet());
    app.use(cors());
    app.use(morgan('dev'));
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    if (localeMiddleware) app.use(localeMiddleware);
    
    app.get('/api/health', (req, res) => {
      console.log('API health check endpoint called on minimal application');
      res.status(200).json({ 
        status: 'ok',
        version: process.env.npm_package_version || '1.0.0',
        environment: process.env.NODE_ENV || 'development',
        mongodb: 'disconnected',
        minimal: true
      });
      console.log('API health check response sent from minimal application');
    });
    
    if (handle404) app.use(handle404);
    if (handleValidationErrors) app.use(handleValidationErrors);
    if (handleErrors) app.use(handleErrors);
    
    // Use a different port than the minimal server
    const PORT = parseInt(process.env.PORT || '5000') + 1;
    console.log(`Starting minimal application without MongoDB on port ${PORT}`);
    
    app.listen(PORT, () => {
      console.log(`Minimal application without MongoDB running on port ${PORT}`);
      console.log(`The original minimal server is still running on port ${process.env.PORT || 5000} for health checks`);
    }).on('error', (err) => {
      console.error('Error starting minimal application without MongoDB:', err);
      console.log('Health checks will still be handled by the minimal server');
    });
    
  } catch (error) {
    console.error('Error setting up minimal application without MongoDB:', error);
    console.log('Health checks will still be handled by the minimal server');
  }
}

module.exports = { startFullApplication };

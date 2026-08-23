const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

const app = express();

// Standard Middlewares
app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'] }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Security Middlewares
app.use(helmet());
// app.use(mongoSanitize()); // Disabled: Crashes on Express 5 because req.query is a getter

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Health check route
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Server is up and running' });
});

const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler.middleware');

// Routes
app.use('/api', routes);

// Global Error Handler
app.use(errorHandler);

module.exports = app;

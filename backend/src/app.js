const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

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

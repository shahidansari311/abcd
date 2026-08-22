const logger = require('../config/logger');
const env = require('../config/env');

const errorHandler = (err, req, res, next) => {
  let { statusCode, message } = err;

  if (!statusCode) statusCode = 500;
  if (!message) message = 'Internal Server Error';

  if (env.NODE_ENV === 'development') {
    logger.error(err);
  } else {
    logger.error(message);
  }

  res.status(statusCode).json({
    success: false,
    message,
    ...(env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = errorHandler;

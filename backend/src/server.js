require('dotenv').config();
const http = require('http');
const app = require('./app');
const env = require('./config/env');
const connectDB = require('./config/db');
const logger = require('./config/logger');
const { initSocket } = require('./socket');

const startServer = async () => {
  await connectDB();
  
  const server = http.createServer(app);
  
  // Initialize Socket.io
  initSocket(server);

  server.listen(env.port, () => {
    logger.info(`Server running on port ${env.port} in ${env.nodeEnv} mode`);
  });
};

startServer();

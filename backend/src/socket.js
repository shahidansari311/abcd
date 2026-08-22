const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const env = require('./config/env');
const logger = require('./config/logger');

let io;

const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: '*', // For local dev
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware
  io.use((socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Authentication error'));
    }
    jwt.verify(token, env.jwt.accessSecret, (err, decoded) => {
      if (err) return next(new Error('Authentication error'));
      socket.user = decoded;
      next();
    });
  });

  io.on('connection', (socket) => {
    logger.info(`User connected to socket: ${socket.user.id}`);
    
    // Join a personal room for direct messages
    socket.join(socket.user.id);

    socket.on('join_workspace', (workspaceId) => {
      socket.join(workspaceId);
      logger.info(`User ${socket.user.id} joined workspace ${workspaceId}`);
    });

    socket.on('send_message', (data) => {
      const { receiverId, workspaceId, content } = data;
      const messagePayload = {
        sender: socket.user.id,
        content,
        timestamp: new Date()
      };

      if (workspaceId) {
        // Group message
        io.to(workspaceId).emit('receive_message', messagePayload);
      } else if (receiverId) {
        // Direct message
        io.to(receiverId).emit('receive_message', messagePayload);
        // Also emit to self for immediate feedback (or handle via frontend state)
        socket.emit('receive_message', messagePayload);
      }
    });

    socket.on('disconnect', () => {
      logger.info(`User disconnected from socket: ${socket.user.id}`);
    });
  });

  return io;
};

const getIo = () => {
  if (!io) {
    throw new Error('Socket.io is not initialized!');
  }
  return io;
};

module.exports = {
  initSocket,
  getIo
};

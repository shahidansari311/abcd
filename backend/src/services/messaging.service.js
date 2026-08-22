const Message = require('../models/Message.model');

const getDirectMessages = async (userId, otherUserId) => {
  return Message.find({
    $or: [
      { sender: userId, receiver: otherUserId },
      { sender: otherUserId, receiver: userId }
    ],
    workspaceId: null
  }).sort({ createdAt: 1 });
};

const getWorkspaceMessages = async (workspaceId) => {
  return Message.find({ workspaceId }).sort({ createdAt: 1 });
};

module.exports = {
  getDirectMessages,
  getWorkspaceMessages
};

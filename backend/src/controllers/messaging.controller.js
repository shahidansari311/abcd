const messagingService = require('../services/messaging.service');
const apiResponse = require('../utils/apiResponse');

const getDirectMessages = async (req, res) => {
  const { otherUserId } = req.params;
  const messages = await messagingService.getDirectMessages(req.user.id, otherUserId);
  return apiResponse(res, 200, true, 'Messages fetched successfully', messages);
};

const getWorkspaceMessages = async (req, res) => {
  const { workspaceId } = req.params;
  const messages = await messagingService.getWorkspaceMessages(workspaceId);
  return apiResponse(res, 200, true, 'Workspace messages fetched successfully', messages);
};

module.exports = {
  getDirectMessages,
  getWorkspaceMessages
};

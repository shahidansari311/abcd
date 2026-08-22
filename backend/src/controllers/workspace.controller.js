const workspaceService = require('../services/workspace.service');
const apiResponse = require('../utils/apiResponse');

const createWorkspace = async (req, res) => {
  const workspace = await workspaceService.createWorkspace(req.user.id, req.body);
  return apiResponse(res, 201, true, 'Workspace created successfully', workspace);
};

const getMyWorkspaces = async (req, res) => {
  const workspaces = await workspaceService.getMyWorkspaces(req.user.id);
  return apiResponse(res, 200, true, 'Workspaces fetched successfully', workspaces);
};

const getWorkspaceById = async (req, res) => {
  const workspace = await workspaceService.getWorkspaceById(req.user.id, req.params.id);
  return apiResponse(res, 200, true, 'Workspace fetched successfully', workspace);
};

const addTask = async (req, res) => {
  const workspace = await workspaceService.addTask(req.user.id, req.params.id, req.body);
  return apiResponse(res, 201, true, 'Task added successfully', workspace);
};

const updateTaskStatus = async (req, res) => {
  const workspace = await workspaceService.updateTaskStatus(req.user.id, req.params.id, req.params.taskId, req.body.status);
  return apiResponse(res, 200, true, 'Task updated successfully', workspace);
};

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  addTask,
  updateTaskStatus
};

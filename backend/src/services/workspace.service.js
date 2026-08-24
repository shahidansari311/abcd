const ProjectWorkspace = require('../models/ProjectWorkspace.model');
const ApiError = require('../utils/apiError');

const createWorkspace = async (userId, data) => {
  // Creator is automatically a member
  const members = data.members ? [...new Set([...data.members, userId])] : [userId];
  const workspace = await ProjectWorkspace.create({
    ...data,
    members
  });
  return workspace;
};

const getMyWorkspaces = async (userId) => {
  return ProjectWorkspace.find({ members: userId })
    .populate('members', 'firstName lastName email role')
    .populate({
      path: 'opportunity',
      select: 'title industryPartner',
      populate: { path: 'industryPartner', select: 'companyName' }
    });
};

const getWorkspaceById = async (userId, workspaceId) => {
  const workspace = await ProjectWorkspace.findOne({ _id: workspaceId, members: userId })
    .populate('members', 'firstName lastName email role');
  if (!workspace) throw new ApiError(404, 'Workspace not found or access denied');
  return workspace;
};

const addTask = async (userId, workspaceId, taskData) => {
  const workspace = await ProjectWorkspace.findOne({ _id: workspaceId, members: userId });
  if (!workspace) throw new ApiError(404, 'Workspace not found or access denied');

  workspace.tasks.push(taskData);
  await workspace.save();
  return workspace;
};

const updateTaskStatus = async (userId, workspaceId, taskId, status) => {
  const workspace = await ProjectWorkspace.findOne({ _id: workspaceId, members: userId });
  if (!workspace) throw new ApiError(404, 'Workspace not found or access denied');

  const task = workspace.tasks.id(taskId);
  if (!task) throw new ApiError(404, 'Task not found');

  task.status = status;
  await workspace.save();
  return workspace;
};

module.exports = {
  createWorkspace,
  getMyWorkspaces,
  getWorkspaceById,
  addTask,
  updateTaskStatus
};

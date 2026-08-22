const express = require('express');
const workspaceController = require('../controllers/workspace.controller');
const auth = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);

router.post('/', asyncHandler(workspaceController.createWorkspace));
router.get('/', asyncHandler(workspaceController.getMyWorkspaces));
router.get('/:id', asyncHandler(workspaceController.getWorkspaceById));
router.post('/:id/tasks', asyncHandler(workspaceController.addTask));
router.put('/:id/tasks/:taskId/status', asyncHandler(workspaceController.updateTaskStatus));

module.exports = router;

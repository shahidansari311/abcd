const express = require('express');
const messagingController = require('../controllers/messaging.controller');
const auth = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);

router.get('/direct/:otherUserId', asyncHandler(messagingController.getDirectMessages));
router.get('/workspace/:workspaceId', asyncHandler(messagingController.getWorkspaceMessages));

module.exports = router;

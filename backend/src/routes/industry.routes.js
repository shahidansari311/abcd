const express = require('express');
const industryController = require('../controllers/industry.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth); // Require authentication for all industry routes
router.use(rbac('industry')); // Require industry role

router.route('/profile')
  .get(asyncHandler(industryController.getProfile))
  .put(asyncHandler(industryController.updateProfile));

module.exports = router;

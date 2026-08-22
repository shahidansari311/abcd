const express = require('express');
const adminController = require('../controllers/admin.controller');
const auth = require('../middlewares/auth.middleware');
const rbac = require('../middlewares/rbac.middleware');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

router.use(auth);
// Note: MVP uses institution_admin as a proxy for platform admin
router.use(rbac('institution_admin'));

router.get('/stats', asyncHandler(adminController.getDashboardStats));

module.exports = router;

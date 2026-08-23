const router = require('express').Router();
const applicationController = require('../controllers/application.controller');
const auth = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(auth);

router.get('/', asyncHandler(applicationController.getApplications));
router.post('/', asyncHandler(applicationController.createApplication));
router.put('/:id', asyncHandler(applicationController.updateApplicationStatus));

module.exports = router;

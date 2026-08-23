const router = require('express').Router();
const communityController = require('../controllers/community.controller');
const auth = require('../middlewares/auth.middleware');
const asyncHandler = require('../utils/asyncHandler');

router.use(auth);

router.get('/posts', asyncHandler(communityController.getPosts));
router.post('/posts', asyncHandler(communityController.createPost));
router.post('/posts/:id/like', asyncHandler(communityController.likePost));

module.exports = router;

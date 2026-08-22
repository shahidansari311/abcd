const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const ApiError = require('../utils/apiError');
const asyncHandler = require('../utils/asyncHandler');

const auth = asyncHandler(async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(new ApiError(401, 'Not authorized, token missing'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      return next(new ApiError(401, 'User belonging to this token no longer exists'));
    }
    if (user.status !== 'active') {
      return next(new ApiError(403, 'User account is not active'));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Not authorized, token failed'));
  }
});

module.exports = auth;

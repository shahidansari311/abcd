const ApiError = require('../utils/apiError');

const rbac = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Not authenticated'));
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return next(new ApiError(403, `Role ${req.user.role} is not authorized to access this route`));
    }
    
    next();
  };
};

module.exports = rbac;

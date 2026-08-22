const jwt = require('jsonwebtoken');
const env = require('../config/env');
const User = require('../models/User.model');
const Student = require('../models/Student.model');
const Industry = require('../models/Industry.model');
const Academician = require('../models/Academician.model');
const Institution = require('../models/Institution.model');
const ApiError = require('../utils/apiError');

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, env.JWT_ACCESS_SECRET, {
    expiresIn: `${env.JWT_ACCESS_EXPIRATION_MINUTES}m`,
  });
  
  const refreshToken = jwt.sign({ id: userId }, env.JWT_REFRESH_SECRET, {
    expiresIn: `${env.JWT_REFRESH_EXPIRATION_DAYS}d`,
  });

  return { accessToken, refreshToken };
};

const registerUser = async (userData) => {
  const { email, password, role, ...rest } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(400, 'Email already in use');
  }

  let user;
  const baseData = { email, passwordHash: password, role }; // Pre-save hook hashes password

  switch (role) {
    case 'student':
      user = await Student.create({ ...baseData, ...rest });
      break;
    case 'industry':
      user = await Industry.create({ ...baseData, ...rest, isVerified: false });
      break;
    case 'academician':
      user = await Academician.create({ ...baseData, ...rest });
      break;
    case 'institution_admin':
      user = await Institution.create({ ...baseData, ...rest, isVerified: false });
      break;
    default:
      throw new ApiError(400, 'Invalid role');
  }

  const tokens = generateTokens(user._id);
  return { user, tokens };
};

const loginUser = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  const isPasswordMatch = await user.isPasswordMatch(password);
  if (!isPasswordMatch) {
    throw new ApiError(401, 'Incorrect email or password');
  }

  if (user.status !== 'active') {
    throw new ApiError(403, 'User account is not active');
  }

  const tokens = generateTokens(user._id);
  return { user, tokens };
};

module.exports = {
  registerUser,
  loginUser,
};

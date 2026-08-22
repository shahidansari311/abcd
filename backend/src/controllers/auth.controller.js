const authService = require('../services/auth.service');
const apiResponse = require('../utils/apiResponse');

const register = async (req, res) => {
  const { user, tokens } = await authService.registerUser(req.body);
  
  const userObj = user.toObject();
  delete userObj.passwordHash;

  return apiResponse(res, 201, true, 'User registered successfully', { user: userObj, tokens });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const { user, tokens } = await authService.loginUser(email, password);

  const userObj = user.toObject();
  delete userObj.passwordHash;

  return apiResponse(res, 200, true, 'Login successful', { user: userObj, tokens });
};

module.exports = {
  register,
  login,
};

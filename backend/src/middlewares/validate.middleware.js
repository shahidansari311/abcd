const ApiError = require('../utils/apiError');

const validate = (schema) => (req, res, next) => {
  try {
    schema.parse({
      body: req.body,
      query: req.query,
      params: req.params,
    });
    next();
  } catch (err) {
    // Handle Zod validation errors (.errors array) or any other thrown error
    const errorMessage = Array.isArray(err.errors)
      ? err.errors.map(e => e.message).join(', ')
      : err.message || 'Validation failed';
    next(new ApiError(400, `Validation Error: ${errorMessage}`));
  }
};

module.exports = validate;

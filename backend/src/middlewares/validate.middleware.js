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
    // Assuming Zod error structure
    const errorMessage = err.errors.map(e => e.message).join(', ');
    next(new ApiError(400, `Validation Error: ${errorMessage}`));
  }
};

module.exports = validate;

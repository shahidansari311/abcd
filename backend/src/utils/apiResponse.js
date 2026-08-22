const apiResponse = (res, statusCode, success, message, data = null, meta = null) => {
  const response = {
    success,
    message,
    ...(data && { data }),
    ...(meta && { meta }),
  };
  return res.status(statusCode).json(response);
};

module.exports = apiResponse;

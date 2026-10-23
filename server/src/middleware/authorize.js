const { errorResponse } = require('../utils/apiResponse');

const authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return errorResponse(res, 403, `Role '${req.user.role}' is not authorized`);
    }
    next();
  };
};

module.exports = { authorize };

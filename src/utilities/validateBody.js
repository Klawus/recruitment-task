const { validationResult } = require('express-validator');
const { errorResponse } = require('../responses');

const validateBody = (req, res, next) => {
  try {
    validationResult(req).throw();
    return next();
  } catch (err) {
    return errorResponse(res, 400, { type: 'VALIDATION', ...err });
  }
};

module.exports = validateBody;

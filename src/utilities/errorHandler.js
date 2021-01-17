const { errorResponse } = require('../responses');
const errorMessages = require('./errors.json');

const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== 'Production') console.log(err);
  if (Object.values(errorMessages).includes(err.message))
    return errorResponse(res, 500, {
      type: 'OTHER',
      message: err.message
    });
  return errorResponse(res, 500, {
    type: 'OTHER',
    message: errorMessages.UNHANDLED_ERROR
  });
};

module.exports = errorHandler;

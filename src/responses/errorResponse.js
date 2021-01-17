const errorResponse = (res, code, error) => {
  return res.status(code).json({ success: false, error });
};

module.exports = errorResponse;

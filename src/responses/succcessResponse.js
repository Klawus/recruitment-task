const successResponse = (res, code, data) => {
  return res.status(code).json({ success: true, data });
};

module.exports = successResponse;

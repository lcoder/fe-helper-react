module.exports = function go2Errors(res, errorMsg) {
  const errorObj = {
    success: false,
    errorMsg: typeof errorMsg === "string" ? errorMsg : errorMsg.message,
    result: null,
  };
  res.json(errorObj);
};

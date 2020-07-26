module.exports = function success(res, result) {
  const obj = {
    success: true,
    result,
  };
  res.json(obj);
};

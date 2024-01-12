exports.responseHandler = (error, code = 200, message = "Succès", data) => ({
  error,
  code,
  message,
  data,
});

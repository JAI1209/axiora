const errorHandler = (err, _req, res, _next) => {
  const status = err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(status).json({ ok: false, message });
};

module.exports = errorHandler;

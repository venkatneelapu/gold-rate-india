/**
 * Centralized Error Handling Middleware
 * Ensures sensitive stack traces are never exposed in production
 */
function errorHandler(err, req, res, next) {
  const statusCode = err.statusCode || err.status || 500;
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(`[Error] ${req.method} ${req.originalUrl}:`, {
    message: err.message,
    statusCode,
    stack: isProduction ? undefined : err.stack
  });

  const response = {
    success: false,
    error: err.message || 'An unexpected internal server error occurred.'
  };

  if (err.retryAfter) {
    response.retryAfter = err.retryAfter;
  }

  if (!isProduction && err.stack) {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
}

module.exports = errorHandler;

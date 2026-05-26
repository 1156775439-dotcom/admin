// 错误处理中间件
const logger = require('../config/logger');

class AppError extends Error {
  constructor(message, status = 500) {
    super(message);
    this.status = status;
  }
}

const errorHandler = (err, req, res, next) => {
  logger.error('错误详情:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';

  res.status(status).json({
    error: message,
    status: status,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};

module.exports = { AppError, errorHandler };

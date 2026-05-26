// JWT 认证中间件
const jwt = require('jsonwebtoken');
const logger = require('../config/logger');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '缺少认证令牌' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'your_jwt_secret', (err, user) => {
    if (err) {
      logger.warn('Token 验证失败:', err.message);
      return res.status(403).json({ error: 'Token 无效或已过期' });
    }
    req.user = user;
    next();
  });
};

module.exports = { authenticateToken };

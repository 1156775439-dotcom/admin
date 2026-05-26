// 用户服务
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../config/logger');

class UserService {
  // 用户注册
  async register(email, password, username) {
    try {
      // 检查用户是否已存在
      const existingUser = await pool.query(
        'SELECT * FROM users WHERE email = $1 OR username = $2',
        [email, username]
      );

      if (existingUser.rows.length > 0) {
        throw new Error('用户邮箱或用户名已存在');
      }

      // 加密密码
      const hashedPassword = await bcrypt.hash(password, 10);

      // 创建用户
      const result = await pool.query(
        'INSERT INTO users (email, username, password) VALUES ($1, $2, $3) RETURNING id, email, username',
        [email, username, hashedPassword]
      );

      logger.info('新用户注册:', { email, username });
      return result.rows[0];
    } catch (error) {
      logger.error('注册失败:', error.message);
      throw error;
    }
  }

  // 用户登录
  async login(email, password) {
    try {
      const result = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );

      if (result.rows.length === 0) {
        throw new Error('用户不存在');
      }

      const user = result.rows[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        throw new Error('密码错误');
      }

      // 生成 JWT Token
      const token = jwt.sign(
        { id: user.id, email: user.email, username: user.username },
        process.env.JWT_SECRET || 'your_jwt_secret',
        { expiresIn: process.env.JWT_EXPIRATION || '7d' }
      );

      logger.info('用户登录:', { email });
      return { token, user: { id: user.id, email: user.email, username: user.username } };
    } catch (error) {
      logger.error('登录失败:', error.message);
      throw error;
    }
  }

  // 获取用户信息
  async getUserById(userId) {
    try {
      const result = await pool.query(
        'SELECT id, email, username, created_at FROM users WHERE id = $1',
        [userId]
      );

      if (result.rows.length === 0) {
        throw new Error('用户不存在');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('获取用户信息失败:', error.message);
      throw error;
    }
  }
}

module.exports = new UserService();

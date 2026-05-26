// 商品服务
const pool = require('../config/database');
const logger = require('../config/logger');

class ProductService {
  // 获取所有商品
  async getAllProducts(limit = 10, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT * FROM products ORDER BY created_at DESC LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error('获取商品列表失败:', error.message);
      throw error;
    }
  }

  // 获取单个商品
  async getProductById(productId) {
    try {
      const result = await pool.query(
        'SELECT * FROM products WHERE id = $1',
        [productId]
      );

      if (result.rows.length === 0) {
        throw new Error('商品不存在');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('获取商品详情失败:', error.message);
      throw error;
    }
  }

  // 创建商品
  async createProduct(name, description, price, stock, category) {
    try {
      const result = await pool.query(
        'INSERT INTO products (name, description, price, stock, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [name, description, price, stock, category]
      );

      logger.info('商品创建成功:', { productId: result.rows[0].id, name });
      return result.rows[0];
    } catch (error) {
      logger.error('创建商品失败:', error.message);
      throw error;
    }
  }

  // 更新商品
  async updateProduct(productId, updates) {
    try {
      const fields = Object.keys(updates);
      const values = Object.values(updates);
      values.push(productId);

      const setClause = fields.map((field, index) => `${field} = $${index + 1}`).join(', ');
      const query = `UPDATE products SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;

      const result = await pool.query(query, values);

      if (result.rows.length === 0) {
        throw new Error('商品不存在');
      }

      logger.info('商品更新成功:', { productId });
      return result.rows[0];
    } catch (error) {
      logger.error('更新商品失败:', error.message);
      throw error;
    }
  }

  // 删除商品
  async deleteProduct(productId) {
    try {
      const result = await pool.query(
        'DELETE FROM products WHERE id = $1 RETURNING id',
        [productId]
      );

      if (result.rows.length === 0) {
        throw new Error('商品不存在');
      }

      logger.info('商品删除成功:', { productId });
      return { id: productId, message: '商品已删除' };
    } catch (error) {
      logger.error('删除商品失败:', error.message);
      throw error;
    }
  }
}

module.exports = new ProductService();

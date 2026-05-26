// 订单服务
const pool = require('../config/database');
const logger = require('../config/logger');

class OrderService {
  // 创建订单
  async createOrder(userId, items, totalAmount) {
    try {
      // 创建订单
      const orderResult = await pool.query(
        'INSERT INTO orders (user_id, total_amount, status) VALUES ($1, $2, $3) RETURNING *',
        [userId, totalAmount, 'pending']
      );

      const order = orderResult.rows[0];

      // 创建订单项
      for (const item of items) {
        await pool.query(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)',
          [order.id, item.product_id, item.quantity, item.price]
        );
      }

      logger.info('订单创建成功:', { orderId: order.id, userId });
      return order;
    } catch (error) {
      logger.error('创建订单失败:', error.message);
      throw error;
    }
  }

  // 获取用户订单
  async getUserOrders(userId, limit = 10, offset = 0) {
    try {
      const result = await pool.query(
        'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3',
        [userId, limit, offset]
      );
      return result.rows;
    } catch (error) {
      logger.error('获取用户订单失败:', error.message);
      throw error;
    }
  }

  // 获取订单详情
  async getOrderById(orderId) {
    try {
      const orderResult = await pool.query(
        'SELECT * FROM orders WHERE id = $1',
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        throw new Error('订单不存在');
      }

      const itemsResult = await pool.query(
        'SELECT * FROM order_items WHERE order_id = $1',
        [orderId]
      );

      return {
        ...orderResult.rows[0],
        items: itemsResult.rows,
      };
    } catch (error) {
      logger.error('获取订单详情失败:', error.message);
      throw error;
    }
  }

  // 更新订单状态
  async updateOrderStatus(orderId, status) {
    try {
      const result = await pool.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
        [status, orderId]
      );

      if (result.rows.length === 0) {
        throw new Error('订单不存在');
      }

      logger.info('订单状态更新成功:', { orderId, status });
      return result.rows[0];
    } catch (error) {
      logger.error('更新订单状态失败:', error.message);
      throw error;
    }
  }

  // 取消订单
  async cancelOrder(orderId) {
    try {
      const result = await pool.query(
        'UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2 AND status != $3 RETURNING *',
        ['cancelled', orderId, 'shipped']
      );

      if (result.rows.length === 0) {
        throw new Error('订单不存在或无法取消');
      }

      logger.info('订单已取消:', { orderId });
      return result.rows[0];
    } catch (error) {
      logger.error('取消订单失败:', error.message);
      throw error;
    }
  }
}

module.exports = new OrderService();

// 库存服务
const pool = require('../config/database');
const logger = require('../config/logger');

class InventoryService {
  // 获取库存信息
  async getInventoryByProductId(productId) {
    try {
      const result = await pool.query(
        'SELECT product_id, quantity, reserved FROM inventory WHERE product_id = $1',
        [productId]
      );

      if (result.rows.length === 0) {
        throw new Error('库存信息不存在');
      }

      return result.rows[0];
    } catch (error) {
      logger.error('获取库存信息失败:', error.message);
      throw error;
    }
  }

  // 更新库存
  async updateInventory(productId, quantity) {
    try {
      const result = await pool.query(
        'UPDATE inventory SET quantity = $1, updated_at = NOW() WHERE product_id = $2 RETURNING *',
        [quantity, productId]
      );

      if (result.rows.length === 0) {
        throw new Error('库存不存在');
      }

      logger.info('库存更新成功:', { productId, quantity });
      return result.rows[0];
    } catch (error) {
      logger.error('更新库存失败:', error.message);
      throw error;
    }
  }

  // 预留库存
  async reserveInventory(productId, quantity) {
    try {
      // 检查库存是否足够
      const inventoryResult = await pool.query(
        'SELECT quantity, reserved FROM inventory WHERE product_id = $1 FOR UPDATE',
        [productId]
      );

      if (inventoryResult.rows.length === 0) {
        throw new Error('库存不存在');
      }

      const inventory = inventoryResult.rows[0];
      const available = inventory.quantity - inventory.reserved;

      if (available < quantity) {
        throw new Error('库存不足');
      }

      // 更新预留库存
      const result = await pool.query(
        'UPDATE inventory SET reserved = reserved + $1 WHERE product_id = $2 RETURNING *',
        [quantity, productId]
      );

      logger.info('库存已预留:', { productId, quantity });
      return result.rows[0];
    } catch (error) {
      logger.error('预留库存失败:', error.message);
      throw error;
    }
  }

  // 释放预留库存
  async releaseReservedInventory(productId, quantity) {
    try {
      const result = await pool.query(
        'UPDATE inventory SET reserved = GREATEST(0, reserved - $1) WHERE product_id = $2 RETURNING *',
        [quantity, productId]
      );

      if (result.rows.length === 0) {
        throw new Error('库存不存在');
      }

      logger.info('预留库存已释放:', { productId, quantity });
      return result.rows[0];
    } catch (error) {
      logger.error('释放预留库存失败:', error.message);
      throw error;
    }
  }
}

module.exports = new InventoryService();

// 更新的库存路由 - 使用服务层
const express = require('express');
const router = express.Router();
const inventoryService = require('../services/inventoryService');
const logger = require('../config/logger');
const { authenticateToken } = require('../middleware/auth');

// 获取库存信息（需要认证）
router.get('/:productId', authenticateToken, async (req, res) => {
  try {
    const inventory = await inventoryService.getInventoryByProductId(req.params.productId);
    res.json({ inventory });
  } catch (error) {
    logger.error('获取库存信息路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 更新库存（需要认证）
router.put('/:productId', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (quantity === undefined) {
      return res.status(400).json({ error: '库存数量不能为空' });
    }

    const inventory = await inventoryService.updateInventory(req.params.productId, quantity);
    res.json({ message: '库存更新成功', inventory });
  } catch (error) {
    logger.error('更新库存路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 预留库存（需要认证）
router.post('/:productId/reserve', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ error: '预留数量不能为空' });
    }

    const inventory = await inventoryService.reserveInventory(req.params.productId, quantity);
    res.json({ message: '库存已预留', inventory });
  } catch (error) {
    logger.error('预留库存路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 释放预留库存（需要认证）
router.post('/:productId/release', authenticateToken, async (req, res) => {
  try {
    const { quantity } = req.body;

    if (!quantity) {
      return res.status(400).json({ error: '释放数量不能为空' });
    }

    const inventory = await inventoryService.releaseReservedInventory(req.params.productId, quantity);
    res.json({ message: '预留库存已释放', inventory });
  } catch (error) {
    logger.error('释放预留库存路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

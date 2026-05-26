// 更新的订单路由 - 使用服务层
const express = require('express');
const router = express.Router();
const orderService = require('../services/orderService');
const logger = require('../config/logger');
const { authenticateToken } = require('../middleware/auth');

// 获取用户订单列表（需要认证）
router.get('/', authenticateToken, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const orders = await orderService.getUserOrders(req.user.id, limit, offset);
    res.json({ orders });
  } catch (error) {
    logger.error('获取订单列表路由错误:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取订单详情（需要认证）
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const order = await orderService.getOrderById(req.params.id);
    res.json({ order });
  } catch (error) {
    logger.error('获取订单详情路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 创建订单（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ error: '订单项不能为空' });
    }

    const order = await orderService.createOrder(req.user.id, items, totalAmount);
    res.status(201).json({ message: '订单创建成功', order });
  } catch (error) {
    logger.error('创建订单路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 更新订单状态（需要认证）
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: '订单状态不能为空' });
    }

    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json({ message: '订单状态更新成功', order });
  } catch (error) {
    logger.error('更新订单状态路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 取消订单（需要认证）
router.post('/:id/cancel', authenticateToken, async (req, res) => {
  try {
    const order = await orderService.cancelOrder(req.params.id);
    res.json({ message: '订单已取消', order });
  } catch (error) {
    logger.error('取消订单路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

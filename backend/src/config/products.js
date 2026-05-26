// 更新的商品路由 - 使用服务层
const express = require('express');
const router = express.Router();
const productService = require('../services/productService');
const logger = require('../config/logger');
const { authenticateToken } = require('../middleware/auth');

// 获取商品列表
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const offset = parseInt(req.query.offset) || 0;

    const products = await productService.getAllProducts(limit, offset);
    res.json({ products, total: products.length });
  } catch (error) {
    logger.error('获取商品列表路由错误:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// 获取单个商品
router.get('/:id', async (req, res) => {
  try {
    const product = await productService.getProductById(req.params.id);
    res.json({ product });
  } catch (error) {
    logger.error('获取商品详情路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 创建商品（需要认证）
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || !price) {
      return res.status(400).json({ error: '商品名称和价格不能为空' });
    }

    const product = await productService.createProduct(name, description, price, stock, category);
    res.status(201).json({ message: '商品创建成功', product });
  } catch (error) {
    logger.error('创建商品路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 更新商品（需要认证）
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);
    res.json({ message: '商品更新成功', product });
  } catch (error) {
    logger.error('更新商品路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

// 删除商品（需要认证）
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const result = await productService.deleteProduct(req.params.id);
    res.json(result);
  } catch (error) {
    logger.error('删除商品路由错误:', error.message);
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;

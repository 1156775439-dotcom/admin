// 前端 API 服务 - 用户相关
import api from './api';

export const userAPI = {
  // 注册
  register: (email, password, username) =>
    api.post('/auth/register', { email, password, username }),

  // 登录
  login: (email, password) =>
    api.post('/auth/login', { email, password }),

  // 获取用户信息
  getProfile: () =>
    api.get('/auth/profile'),

  // 登出
  logout: () =>
    api.post('/auth/logout'),
};

export const productAPI = {
  // 获取商品列表
  getProducts: (limit = 10, offset = 0) =>
    api.get('/products', { params: { limit, offset } }),

  // 获取商品详情
  getProductById: (id) =>
    api.get(`/products/${id}`),

  // 创建商品
  createProduct: (product) =>
    api.post('/products', product),

  // 更新商品
  updateProduct: (id, product) =>
    api.put(`/products/${id}`, product),

  // 删除商品
  deleteProduct: (id) =>
    api.delete(`/products/${id}`),
};

export const orderAPI = {
  // 获取订单列表
  getOrders: (limit = 10, offset = 0) =>
    api.get('/orders', { params: { limit, offset } }),

  // 获取订单详情
  getOrderById: (id) =>
    api.get(`/orders/${id}`),

  // 创建订单
  createOrder: (order) =>
    api.post('/orders', order),

  // 更新订单状态
  updateOrderStatus: (id, status) =>
    api.put(`/orders/${id}/status`, { status }),

  // 取消订单
  cancelOrder: (id) =>
    api.post(`/orders/${id}/cancel`),
};

export const inventoryAPI = {
  // 获取库存信息
  getInventory: (productId) =>
    api.get(`/inventory/${productId}`),

  // 更新库存
  updateInventory: (productId, quantity) =>
    api.put(`/inventory/${productId}`, { quantity }),

  // 预留库存
  reserveInventory: (productId, quantity) =>
    api.post(`/inventory/${productId}/reserve`, { quantity }),

  // 释放预留库存
  releaseInventory: (productId, quantity) =>
    api.post(`/inventory/${productId}/release`, { quantity }),
};

export const paymentAPI = {
  // 创建支付
  createPayment: (payment) =>
    api.post('/payments/create', payment),

  // 支付回调
  paymentWebhook: (data) =>
    api.post('/payments/webhook', data),
};
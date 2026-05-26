# 安装依赖

## 后端

```bash
cd backend
npm install
```

## 前端

```bash
cd frontend
npm install
```

# 环境配置

## 后端环境变量

复制 `backend/.env.example` 为 `backend/.env`，然后配置：

```bash
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=ecommerce_db
DB_USER=postgres
DB_PASSWORD=password
REDIS_HOST=localhost
REDIS_PORT=6379
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRATION=7d
FRONTEND_URL=http://localhost:3000
```

## 数据库设置

### 使用 Docker

```bash
docker-compose up -d
```

### 或本地 PostgreSQL

```bash
# 创建数据库
createdb ecommerce_db

# 数据库会在应用启动时自动初始化表
```

# 启动应用

## 开发模式

```bash
# 启动后端 (http://localhost:5000)
cd backend
npm run dev

# 启动前端 (http://localhost:3000)
cd frontend
npm start
```

## Docker 方式

```bash
docker-compose up -d
```

# 功能特性

## 已实现

- ✅ 用户认证（注册、登录、登出）
- ✅ JWT 令牌认证
- ✅ 商品管理（增删改查）
- ✅ 订单管理（创建、查询、状态更新、取消）
- ✅ 库存管理（查询、更新、预留、释放）
- ✅ 错误处理和日志记录
- ✅ 前端 Redux 状态管理
- ✅ 前端 API 服务层
- ✅ 认证页面
- ✅ 商品管理页面
- ✅ 订单管理页面

## 待实现

- 支付集成（Stripe）
- 自动化工作流引擎
- 数据分析与报表
- 前端路由和导航
- 前端表单验证完善
- 文件上传功能
- 搜索和过滤功能

# API 端点

## 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录
- `GET /api/auth/profile` - 获取用户信息
- `POST /api/auth/logout` - 用户登出

## 商品
- `GET /api/products` - 获取商品列表
- `GET /api/products/:id` - 获取商品详情
- `POST /api/products` - 创建商品
- `PUT /api/products/:id` - 更新商品
- `DELETE /api/products/:id` - 删除商品

## 订单
- `GET /api/orders` - 获取订单列表
- `GET /api/orders/:id` - 获取订单详情
- `POST /api/orders` - 创建订单
- `PUT /api/orders/:id/status` - 更新订单状态
- `POST /api/orders/:id/cancel` - 取消订单

## 库存
- `GET /api/inventory/:productId` - 获取库存信息
- `PUT /api/inventory/:productId` - 更新库存
- `POST /api/inventory/:productId/reserve` - 预留库存
- `POST /api/inventory/:productId/release` - 释放预留库存

## 支付
- `POST /api/payments/create` - 创建支付
- `POST /api/payments/webhook` - 支付回调

# 项目结构

```
.
├── backend/
│   ├── src/
│   │   ├── config/           # 配置文件
│   │   ├── middleware/       # 中间件
│   │   ├── routes/           # 路由
│   │   ├── services/         # 服务层
│   │   ├── utils/            # 工具函数
│   │   └── app.js            # 应用入口
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/       # 组件
│   │   ├── pages/            # 页面
│   │   ├── services/         # API 服务
│   │   ├── store/            # Redux 状态
│   │   ├── styles/           # 样式
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── docker-compose.yml
├── README.md
└── .gitignore
```
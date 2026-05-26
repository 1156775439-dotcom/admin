import React, { useEffect, useState } from 'react';
import { Table, Button, Tag, Space, message, Popconfirm } from 'antd';
import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { orderAPI } from '../services';

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getOrders();
      setOrders(response.orders || []);
    } catch (error) {
      message.error('获取订单列表失败');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await orderAPI.updateOrderStatus(orderId, newStatus);
      message.success('订单状态已更新');
      fetchOrders();
    } catch (error) {
      message.error('更新失败');
    }
  };

  const handleCancel = async (orderId) => {
    try {
      await orderAPI.cancelOrder(orderId);
      message.success('订单已取消');
      fetchOrders();
    } catch (error) {
      message.error('取消失败');
    }
  };

  const getStatusColor = (status) => {
    const colorMap = {
      pending: 'orange',
      processing: 'blue',
      shipped: 'cyan',
      delivered: 'green',
      cancelled: 'red',
    };
    return colorMap[status] || 'default';
  };

  const getStatusText = (status) => {
    const textMap = {
      pending: '待处理',
      processing: '处理中',
      shipped: '已发货',
      delivered: '已送达',
      cancelled: '已取消',
    };
    return textMap[status] || status;
  };

  const columns = [
    {
      title: '订单ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: '金额',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (amount) => `¥${amount}`,
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={getStatusColor(status)}>{getStatusText(status)}</Tag>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date) => new Date(date).toLocaleString(),
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="small">
          {record.status === 'pending' && (
            <Popconfirm
              title="确认发货？"
              onConfirm={() => handleStatusChange(record.id, 'shipped')}
            >
              <Button type="primary" size="small" icon={<CheckOutlined />}>
                发货
              </Button>
            </Popconfirm>
          )}
          {record.status !== 'shipped' && record.status !== 'cancelled' && (
            <Popconfirm
              title="确认取消？"
              onConfirm={() => handleCancel(record.id)}
            >
              <Button danger size="small" icon={<CloseOutlined />}>
                取消
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="page-container">
      <h1>订单管理</h1>
      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
}

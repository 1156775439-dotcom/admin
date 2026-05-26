import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Form, Input, Button, Card, message } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { userAPI } from '../services';
import { loginSuccess, loginFailure, setLoading } from '../store/authSlice';
import './auth.css';

export default function LoginPage() {
  const dispatch = useDispatch();
  const [isRegister, setIsRegister] = useState(false);
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    try {
      dispatch(setLoading(true));

      if (isRegister) {
        // 注册
        await userAPI.register(values.email, values.password, values.username);
        message.success('注册成功，请登录');
        setIsRegister(false);
        form.resetFields();
      } else {
        // 登录
        const response = await userAPI.login(values.email, values.password);
        dispatch(loginSuccess({
          user: response.user,
          token: response.token,
        }));
        message.success('登录成功');
        // 重定向到首页
        window.location.href = '/';
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      dispatch(loginFailure(errorMsg));
      message.error(errorMsg);
    }
  };

  return (
    <div className="auth-container">
      <Card className="auth-card">
        <h1>{isRegister ? '用户注册' : '用户登录'}</h1>
        
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          autoComplete="off"
        >
          {isRegister && (
            <Form.Item
              name="username"
              label="用户名"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="输入用户名"
              />
            </Form.Item>
          )}

          <Form.Item
            name="email"
            label="邮箱"
            rules={[
              { required: true, message: '请输入邮箱' },
              { type: 'email', message: '请输入有效的邮箱' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="输入邮箱"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="密码"
            rules={[{ required: true, message: '请输入密码' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="输入密码"
            />
          </Form.Item>

          {isRegister && (
            <Form.Item
              name="confirmPassword"
              label="确认密码"
              dependencies={['password']}
              rules={[
                { required: true, message: '请确认密码' },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('密码不匹配'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="再次输入密码"
              />
            </Form.Item>
          )}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {isRegister ? '注册' : '登录'}
            </Button>
          </Form.Item>
        </Form>

        <div className="auth-toggle">
          {isRegister ? (
            <>
              已有账户？
              <a onClick={() => setIsRegister(false)}>立即登录</a>
            </>
          ) : (
            <>
              没有账户？
              <a onClick={() => setIsRegister(true)}>去注册</a>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}

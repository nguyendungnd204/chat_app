import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../hooks/useRedux'
import { loginStart, loginSuccess, loginFailure } from '../../store/slice/authSlice'
import { authAPI } from '../../services/api'
import './index.css'

const { Title, Text } = Typography

const Login: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true)
    dispatch(loginStart())

    try {
      const response = await authAPI.login(values)
      dispatch(loginSuccess(response.data))
      message.success('Đăng nhập thành công!')
      navigate('/')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Đăng nhập thất bại'
      dispatch(loginFailure(errorMessage))
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-container">
      <Card className="login-card">
        <div className="login-header">
          <Title level={2}>ChatApp</Title>
          <Text type="secondary">Đăng nhập để tiếp tục</Text>
        </div>

        <Form
          name="login"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<UserOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div className="login-footer">
            <Text>
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Login

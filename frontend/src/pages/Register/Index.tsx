import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Form, Input, Button, Card, Typography, message } from 'antd'
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons'
import { useAppDispatch } from '../../hooks/useRedux'
import { loginSuccess } from '../../store/slice/authSlice'
import { authAPI } from '../../services/api'
import './index.css'

const { Title, Text } = Typography

const Register: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  const onFinish = async (values: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => {
    setLoading(true)

    try {
      const response = await authAPI.register(values)
      dispatch(loginSuccess(response.data))
      message.success('Đăng ký thành công!')
      navigate('/')
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || 'Đăng ký thất bại'
      message.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <Card className="register-card">
        <div className="register-header">
          <Title level={2}>ChatApp</Title>
          <Text type="secondary">Tạo tài khoản mới</Text>
        </div>

        <Form
          name="register"
          onFinish={onFinish}
          autoComplete="off"
          layout="vertical"
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập tên!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Tên" size="large" />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' },
            ]}
          >
            <Input
              prefix={<MailOutlined />}
              placeholder="Email"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu ít nhất 6 ký tự!' },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Mật khẩu"
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="Xác nhận mật khẩu"
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
              Đăng ký
            </Button>
          </Form.Item>

          <div className="register-footer">
            <Text>
              Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
            </Text>
          </div>
        </Form>
      </Card>
    </div>
  )
}

export default Register

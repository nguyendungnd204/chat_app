import React from 'react'
import { Layout, Avatar, Typography, Space, Badge } from 'antd'
import { PhoneOutlined, VideoCameraOutlined, MoreOutlined } from '@ant-design/icons'
import { useAppSelector } from '../../hooks/useRedux'
import './index.css'

const { Header } = Layout
const { Text } = Typography

const ChatHeader: React.FC = () => {
  const { currentConversation, onlineUsers } = useAppSelector((state) => state.chat)
  const { user } = useAppSelector((state) => state.auth)

  if (!currentConversation) return null

  const otherUser = currentConversation.participants.find((p) => p.id !== user?.id)
  const isOnline = otherUser && onlineUsers.includes(otherUser.id)

  return (
    <Header className="chat-header">
      <Space>
        <Badge dot={isOnline} status="success">
          <Avatar src={otherUser?.avatar} size={40}>
            {otherUser?.name[0]?.toUpperCase()}
          </Avatar>
        </Badge>
        <div className="chat-header__user-info">
          <Text strong>{otherUser?.name}</Text>
          <br />
          <Text type="secondary" className="chat-header__user-status">
            {isOnline ? 'Đang hoạt động' : 'Không hoạt động'}
          </Text>
        </div>
      </Space>

      <Space size="large" className="chat-header__actions">
        <PhoneOutlined className="chat-header__action-icon" />
        <VideoCameraOutlined className="chat-header__action-icon" />
        <MoreOutlined className="chat-header__action-icon chat-header__action-icon--more" />
      </Space>
    </Header>
  )
}

export default ChatHeader

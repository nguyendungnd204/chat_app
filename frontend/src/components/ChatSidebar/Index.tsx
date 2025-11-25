import React, { useEffect, useState } from 'react'
import { Layout, Input, List, Avatar, Badge, Typography, Space, Button } from 'antd'
import { SearchOutlined, MessageOutlined, LogoutOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '../../hooks/useRedux'
import { setConversations, setCurrentConversation } from '../../store/slice/chatSlice'
import { logout } from '../../store/slice/authSlice'
import { chatAPI } from '../../services/api'
import type { Conversation } from '../../types'
import { format } from 'date-fns'
import './index.css'

const { Header } = Layout
const { Text } = Typography

const ChatSidebar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { conversations, onlineUsers } = useAppSelector((state) => state.chat)
  const { user } = useAppSelector((state) => state.auth)

  useEffect(() => {
    loadConversations()
  }, [])

  const loadConversations = async () => {
    try {
      const response = await chatAPI.getConversations()
      dispatch(setConversations(response.data))
    } catch (error) {
      console.error('Failed to load conversations:', error)
    }
  }

  const handleConversationClick = (conversation: Conversation) => {
    dispatch(setCurrentConversation(conversation))
    navigate(`/chat/${conversation.id}`)
  }

  const handleLogout = () => {
    dispatch(logout())
    navigate('/login')
  }

  const filteredConversations = conversations.filter((conv) =>
    conv.participants.some((p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  )

  return (
    <Layout className="chat-sidebar">
      <Header className="chat-sidebar__header">
        <Space direction="vertical" className="chat-sidebar__header-content" size="small">
          <Space className="chat-sidebar__header-top">
            <Text strong className="chat-sidebar__title">
              <MessageOutlined /> Chats
            </Text>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              danger
            />
          </Space>
          <Input
            placeholder="Tìm kiếm..."
            prefix={<SearchOutlined />}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </Space>
      </Header>

      <List
        dataSource={filteredConversations}
        renderItem={(conversation) => {
          const otherUser = conversation.participants.find((p) => p.id !== user?.id)
          const isOnline = otherUser && onlineUsers.includes(otherUser.id)

          return (
            <List.Item
              className="chat-sidebar__list-item"
              onClick={() => handleConversationClick(conversation)}
            >
              <List.Item.Meta
                avatar={
                  <Badge dot={isOnline} status="success">
                    <Avatar src={otherUser?.avatar} size={48}>
                      {otherUser?.name[0]?.toUpperCase()}
                    </Avatar>
                  </Badge>
                }
                title={
                  <Space className="chat-sidebar__conversation-title">
                    <Text strong>{otherUser?.name}</Text>
                    {conversation.unread_count > 0 && (
                      <Badge count={conversation.unread_count} />
                    )}
                  </Space>
                }
                description={
                  <div>
                    <Text type="secondary" ellipsis className="chat-sidebar__message-preview">
                      {conversation.last_message?.content || 'Chưa có tin nhắn'}
                    </Text>
                    {conversation.last_message && (
                      <Text type="secondary" className="chat-sidebar__message-time">
                        {format(new Date(conversation.last_message.created_at), 'HH:mm')}
                      </Text>
                    )}
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
    </Layout>
  )
}

export default ChatSidebar

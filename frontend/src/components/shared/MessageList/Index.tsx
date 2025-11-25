import React, { useEffect, useRef } from 'react'
import { List, Avatar, Typography, Space, Spin } from 'antd'
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux'
import { setMessages } from '../../../store/slice/chatSlice'
import { chatAPI } from '../../../services/api'
import type { Message } from '../../../types'
import { format, isToday, isYesterday } from 'date-fns'
import './index.css'

const { Text } = Typography

interface MessageListProps {
  conversationId: number
}

const MessageList: React.FC<MessageListProps> = ({ conversationId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const messages = useAppSelector((state) => state.chat.messages[conversationId] || [])
  const { user } = useAppSelector((state) => state.auth)
  const [loading, setLoading] = React.useState(false)

  useEffect(() => {
    loadMessages()
  }, [conversationId])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const loadMessages = async () => {
    setLoading(true)
    try {
      const response = await chatAPI.getMessages(conversationId)
      dispatch(setMessages({ conversationId, messages: response.data.data }))
    } catch (error) {
      console.error('Failed to load messages:', error)
    } finally {
      setLoading(false)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const formatMessageTime = (dateString: string) => {
    const date = new Date(dateString)
    if (isToday(date)) return format(date, 'HH:mm')
    if (isYesterday(date)) return `Hôm qua ${format(date, 'HH:mm')}`
    return format(date, 'dd/MM/yyyy HH:mm')
  }

  if (loading) {
    return (
      <div className="message-list__loading">
        <Spin size="large" />
      </div>
    )
  }

  return (
    <div className="message-list">
      <List
        dataSource={messages}
        renderItem={(message: Message) => {
          const isOwn = message.sender_id === user?.id
          return (
            <div
              key={message.id}
              className={`message-list__item ${isOwn ? 'message-list__item--own' : 'message-list__item--other'}`}
            >
              <Space align="start" direction={isOwn ? 'horizontal' : 'horizontal'}>
                {!isOwn && (
                  <Avatar src={message.sender?.avatar}>
                    {message.sender?.name[0]?.toUpperCase()}
                  </Avatar>
                )}
                <div>
                  <div className={`message-list__bubble ${isOwn ? 'message-list__bubble--own' : 'message-list__bubble--other'}`}>
                    <Text className={isOwn ? 'message-list__bubble-text--own' : 'message-list__bubble-text--other'}>
                      {message.content}
                    </Text>
                  </div>
                  <Text
                    type="secondary"
                    className={`message-list__time ${isOwn ? 'message-list__time--own' : 'message-list__time--other'}`}
                  >
                    {formatMessageTime(message.created_at)}
                  </Text>
                </div>
              </Space>
            </div>
          )
        }}
      />
      <div ref={messagesEndRef} />
    </div>
  )
}

export default MessageList

import React from 'react'
import { Layout, Row, Col } from 'antd'
import { useParams } from 'react-router-dom'
import ChatSidebar from '../../components/ChatSidebar/Index'
import MessageList from '../../components/shared/MessageList/Index'
import MessageInput from '../../components/shared/MessageInput/Index'
import { useSocket } from '../../hooks/useSocket'
import ChatHeader from '../../components/ChatHeader/Index'
import './index.css'

const { Content } = Layout

const ChatLayout: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>()
  
  // Initialize socket connection
  useSocket()

  return (
    <Layout className="chat-layout">
      <Row className="chat-layout__row">
        {/* Sidebar */}
        <Col xs={24} sm={8} md={6} lg={6} xl={5} className="chat-layout__sidebar">
          <ChatSidebar />
        </Col>

        {/* Main Chat Area */}
        <Col xs={24} sm={16} md={18} lg={18} xl={19}>
          {conversationId ? (
            <Layout className="chat-layout__main">
              <ChatHeader />
              <Content className="chat-layout__content">
                <MessageList conversationId={parseInt(conversationId)} />
                <MessageInput conversationId={parseInt(conversationId)} />
              </Content>
            </Layout>
          ) : (
            <div className="chat-layout__empty">
              Chọn một cuộc trò chuyện để bắt đầu
            </div>
          )}
        </Col>
      </Row>
    </Layout>
  )
}

export default ChatLayout

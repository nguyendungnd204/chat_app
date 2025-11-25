import React, { useState, useRef } from 'react'
import { Input, Button, Space, Upload, message as antMessage } from 'antd'
import {
  SendOutlined,
  SmileOutlined,
  PictureOutlined,
  PaperClipOutlined,
} from '@ant-design/icons'
import type { UploadFile } from 'antd'
import { useSocket } from '../../../hooks/useSocket'
import { chatAPI } from '../../../services/api'
import './index.css'

interface MessageInputProps {
  conversationId: number
}

const MessageInput: React.FC<MessageInputProps> = ({ conversationId }) => {
  const [message, setMessage] = useState('')
  const [fileList, setFileList] = useState<UploadFile[]>([])
  const [uploading, setUploading] = useState(false)
  const inputRef = useRef<any>(null)
  const { sendMessage, sendTyping } = useSocket()

  const handleSend = async () => {
    if (!message.trim() && fileList.length === 0) return

    try {
      // Upload files if any
      const attachmentIds: number[] = []
      if (fileList.length > 0) {
        setUploading(true)
        for (const file of fileList) {
          if (file.originFileObj) {
            const response = await chatAPI.uploadFile(file.originFileObj)
            attachmentIds.push(response.data.id)
          }
        }
        setUploading(false)
      }

      // Send message via socket
      sendMessage(conversationId, message.trim(), attachmentIds as any)

      // Clear input
      setMessage('')
      setFileList([])
      inputRef.current?.focus()
    } catch (error) {
      console.error('Failed to send message:', error)
      antMessage.error('Gửi tin nhắn thất bại')
      setUploading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value)
    sendTyping(conversationId, e.target.value.length > 0)
  }

  return (
    <div className="message-input">
      <Space.Compact style={{ width: '100%' }}>
        <Upload
          fileList={fileList}
          onChange={({ fileList }) => setFileList(fileList)}
          beforeUpload={() => false}
          showUploadList={false}
        >
          <Button icon={<PictureOutlined />} />
        </Upload>
        <Button icon={<PaperClipOutlined />} />
        <Button icon={<SmileOutlined />} />
        
        <Input.TextArea
          ref={inputRef}
          value={message}
          onChange={handleChange}
          onKeyPress={handleKeyPress}
          placeholder="Aa"
          autoSize={{ minRows: 1, maxRows: 4 }}
          style={{ flex: 1 }}
        />
        
        <Button
          type="primary"
          icon={<SendOutlined />}
          onClick={handleSend}
          loading={uploading}
          disabled={!message.trim() && fileList.length === 0}
        >
          Gửi
        </Button>
      </Space.Compact>

      {fileList.length > 0 && (
        <div className="message-input__attachments">
          {fileList.map((file) => (
            <span key={file.uid} className="message-input__attachment-item">
              📎 {file.name}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default MessageInput

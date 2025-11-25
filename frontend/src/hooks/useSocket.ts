import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { io, Socket } from 'socket.io-client'
import type { RootState } from '../store/store'
import type { Message, Attachment } from '../types'
import {
  addMessage,
  updateMessage,
  addOnlineUser,
  removeOnlineUser,
  setUserTyping,
} from '../store/slice/chatSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:6001'

interface UseSocketReturn {
  sendMessage: (
    conversationId: number,
    content: string,
    attachments?: Attachment[]
  ) => void
  sendTyping: (conversationId: number, isTyping: boolean) => void
  markAsRead: (conversationId: number, messageId: number) => void
  socket: Socket | null
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    if (!user) return

    // Initialize socket connection
    socketRef.current = io(SOCKET_URL, {
      auth: {
        token: localStorage.getItem('token'),
      },
    })

    const socket = socketRef.current

    // Connection events
    socket.on('connect', () => {
      console.log('Socket connected:', socket.id)
    })

    socket.on('disconnect', () => {
      console.log('Socket disconnected')
    })

    // Chat events
    socket.on('message:new', (message: Message) => {
      dispatch(
        addMessage({
          conversationId: message.conversation_id,
          message,
        })
      )
    })

    socket.on(
      'message:updated',
      ({
        conversationId,
        messageId,
        updates,
      }: {
        conversationId: number
        messageId: number
        updates: Partial<Message>
      }) => {
        dispatch(updateMessage({ conversationId, messageId, updates }))
      }
    )

    socket.on('user:online', (userId: number) => {
      dispatch(addOnlineUser(userId))
    })

    socket.on('user:offline', (userId: number) => {
      dispatch(removeOnlineUser(userId))
    })

    socket.on(
      'user:typing',
      ({
        conversationId,
        userId,
        isTyping,
      }: {
        conversationId: number
        userId: number
        isTyping: boolean
      }) => {
        dispatch(setUserTyping({ conversationId, userId, isTyping }))
      }
    )

    // Cleanup
    return () => {
      socket.disconnect()
    }
  }, [user, dispatch])

  const sendMessage = (
    conversationId: number,
    content: string,
    attachments: Attachment[] = []
  ) => {
    if (socketRef.current) {
      socketRef.current.emit('message:send', {
        conversationId,
        content,
        attachments,
      })
    }
  }

  const sendTyping = (conversationId: number, isTyping: boolean) => {
    if (socketRef.current) {
      socketRef.current.emit('user:typing', { conversationId, isTyping })
    }
  }

  const markAsRead = (conversationId: number, messageId: number) => {
    if (socketRef.current) {
      socketRef.current.emit('message:read', { conversationId, messageId })
    }
  }

  return {
    sendMessage,
    sendTyping,
    markAsRead,
    socket: socketRef.current,
  }
}

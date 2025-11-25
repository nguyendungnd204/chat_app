import { useEffect, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import io from 'socket.io-client'
import {
  addMessage,
  updateMessage,
  addOnlineUser,
  removeOnlineUser,
  setUserTyping,
} from '../store/slice/chatSlice'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:6001'

export const useSocket = () => {
  const socketRef = useRef(null)
  const dispatch = useDispatch()
  const { user } = useSelector((state) => state.auth)

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
    socket.on('message:new', (message) => {
      dispatch(
        addMessage({
          conversationId: message.conversation_id,
          message,
        })
      )
    })

    socket.on('message:updated', ({ conversationId, messageId, updates }) => {
      dispatch(updateMessage({ conversationId, messageId, updates }))
    })

    socket.on('user:online', (userId) => {
      dispatch(addOnlineUser(userId))
    })

    socket.on('user:offline', (userId) => {
      dispatch(removeOnlineUser(userId))
    })

    socket.on('user:typing', ({ conversationId, userId, isTyping }) => {
      dispatch(setUserTyping({ conversationId, userId, isTyping }))
    })

    // Cleanup
    return () => {
      socket.disconnect()
    }
  }, [user, dispatch])

  const sendMessage = (conversationId, content, attachments = []) => {
    if (socketRef.current) {
      socketRef.current.emit('message:send', {
        conversationId,
        content,
        attachments,
      })
    }
  }

  const sendTyping = (conversationId, isTyping) => {
    if (socketRef.current) {
      socketRef.current.emit('user:typing', { conversationId, isTyping })
    }
  }

  const markAsRead = (conversationId, messageId) => {
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

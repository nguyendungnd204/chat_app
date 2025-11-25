import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { ChatState, Conversation, Message } from '../../types'

const initialState: ChatState = {
  conversations: [],
  currentConversation: null,
  messages: {},
  onlineUsers: [],
  typingUsers: {},
  loading: false,
  error: null,
}

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload
    },
    setCurrentConversation: (state, action: PayloadAction<Conversation | null>) => {
      state.currentConversation = action.payload
    },
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: number; messages: Message[] }>
    ) => {
      const { conversationId, messages } = action.payload
      state.messages[conversationId] = messages
    },
    addMessage: (
      state,
      action: PayloadAction<{ conversationId: number; message: Message }>
    ) => {
      const { conversationId, message } = action.payload
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = []
      }
      state.messages[conversationId].push(message)
    },
    updateMessage: (
      state,
      action: PayloadAction<{
        conversationId: number
        messageId: number
        updates: Partial<Message>
      }>
    ) => {
      const { conversationId, messageId, updates } = action.payload
      const messages = state.messages[conversationId]
      if (messages) {
        const index = messages.findIndex((m) => m.id === messageId)
        if (index !== -1) {
          messages[index] = { ...messages[index], ...updates }
        }
      }
    },
    setOnlineUsers: (state, action: PayloadAction<number[]>) => {
      state.onlineUsers = action.payload
    },
    addOnlineUser: (state, action: PayloadAction<number>) => {
      if (!state.onlineUsers.includes(action.payload)) {
        state.onlineUsers.push(action.payload)
      }
    },
    removeOnlineUser: (state, action: PayloadAction<number>) => {
      state.onlineUsers = state.onlineUsers.filter((id) => id !== action.payload)
    },
    setUserTyping: (
      state,
      action: PayloadAction<{
        conversationId: number
        userId: number
        isTyping: boolean
      }>
    ) => {
      const { conversationId, userId, isTyping } = action.payload
      if (!state.typingUsers[conversationId]) {
        state.typingUsers[conversationId] = []
      }
      if (isTyping) {
        if (!state.typingUsers[conversationId].includes(userId)) {
          state.typingUsers[conversationId].push(userId)
        }
      } else {
        state.typingUsers[conversationId] = state.typingUsers[
          conversationId
        ].filter((id) => id !== userId)
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload
    },
  },
})

export const {
  setConversations,
  setCurrentConversation,
  setMessages,
  addMessage,
  updateMessage,
  setOnlineUsers,
  addOnlineUser,
  removeOnlineUser,
  setUserTyping,
  setLoading,
  setError,
} = chatSlice.actions

export default chatSlice.reducer

// Type definitions for Redux store
export interface User {
  id: number
  name: string
  email: string
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: number
  conversation_id: number
  sender_id: number
  content: string
  attachments?: Attachment[]
  is_read: boolean
  created_at: string
  updated_at: string
  sender?: User
}

export interface Conversation {
  id: number
  participants: User[]
  last_message?: Message
  unread_count: number
  created_at: string
  updated_at: string
}

export interface Attachment {
  id: number
  type: 'image' | 'file' | 'video' | 'audio'
  url: string
  name: string
  size: number
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  loading: boolean
  error: string | null
}

export interface ChatState {
  conversations: Conversation[]
  currentConversation: Conversation | null
  messages: Record<number, Message[]>
  onlineUsers: number[]
  typingUsers: Record<number, number[]>
  loading: boolean
  error: string | null
}

export interface RootState {
  auth: AuthState
  chat: ChatState
}

// API Response types
export interface LoginResponse {
  user: User
  token: string
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
}

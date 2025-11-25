import axios, { AxiosInstance } from 'axios'
import type {
  User,
  Conversation,
  Message,
  LoginResponse,
} from '../types'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth APIs
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post<LoginResponse>('/auth/login', credentials),
  register: (userData: {
    name: string
    email: string
    password: string
    password_confirmation: string
  }) => api.post<LoginResponse>('/auth/register', userData),
  logout: () => api.post('/auth/logout'),
  me: () => api.get<User>('/auth/me'),
}

// Chat APIs
export const chatAPI = {
  getConversations: () => api.get<Conversation[]>('/conversations'),
  getConversation: (id: number) => api.get<Conversation>(`/conversations/${id}`),
  createConversation: (userId: number) =>
    api.post<Conversation>('/conversations', { user_id: userId }),
  getMessages: (conversationId: number, page: number = 1) =>
    api.get<{ data: Message[]; total: number; current_page: number }>(
      `/conversations/${conversationId}/messages`,
      { params: { page } }
    ),
  sendMessage: (
    conversationId: number,
    data: { content: string; attachments?: number[] }
  ) => api.post<Message>(`/conversations/${conversationId}/messages`, data),
  uploadFile: (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    return api.post<{ url: string; id: number; type: string; name: string }>(
      '/upload',
      formData,
      {
        headers: { 'Content-Type': 'multipart/form-data' },
      }
    )
  },
}

// User APIs
export const userAPI = {
  search: (query: string) => api.get<User[]>('/users/search', { params: { q: query } }),
  getUser: (id: number) => api.get<User>(`/users/${id}`),
}

export default api

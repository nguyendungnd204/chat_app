import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ChatLayout from './layouts/ChatLayout/Index'
import Login from './pages/Login/Index'
import Register from './pages/Register/Index'

const App: React.FC = () => {
  // TODO: Implement actual auth check from Redux
  const isAuthenticated = false

  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/"
        element={isAuthenticated ? <ChatLayout /> : <Navigate to="/login" />}
      />
      <Route
        path="/chat/:conversationId"
        element={isAuthenticated ? <ChatLayout /> : <Navigate to="/login" />}
      />
    </Routes>
  )
}

export default App

# ChatApp Frontend - Messenger Clone

Ứng dụng chat real-time được xây dựng bằng React + TypeScript + Redux Toolkit + Ant Design + Socket.io

## 🚀 Tech Stack

- **React 19** - UI Framework
- **TypeScript** - Type Safety
- **Redux Toolkit** - State Management
- **Ant Design** - UI Components
- **Socket.io Client** - Real-time Communication
- **React Router v6** - Routing
- **Axios** - HTTP Client
- **Vite** - Build Tool
- **date-fns** - Date Formatting
- **react-hook-form** - Form Handling
- **zod** - Validation

## 📁 Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/          # Reusable components
│   │   ├── ChatHeader/
│   │   │   ├── Index.tsx
│   │   │   └── index.css
│   │   ├── ChatSidebar/
│   │   │   ├── Index.tsx
│   │   │   └── index.css
│   │   └── shared/          # Shared components
│   │       ├── MessageList/
│   │       │   ├── Index.tsx
│   │       │   └── index.css
│   │       └── MessageInput/
│   │           ├── Index.tsx
│   │           └── index.css
│   ├── hooks/               # Custom hooks
│   │   ├── useRedux.ts      # Typed Redux hooks
│   │   └── useSocket.ts     # Socket.io hook
│   ├── layouts/             # Layout components
│   │   └── ChatLayout/
│   │       ├── Index.tsx
│   │       └── index.css
│   ├── pages/               # Page components
│   │   ├── Login/
│   │   │   ├── Index.tsx
│   │   │   └── index.css
│   │   └── Register/
│   │       ├── Index.tsx
│   │       └── index.css
│   ├── services/            # API services
│   │   └── api.ts
│   ├── store/               # Redux store
│   │   ├── slice/
│   │   │   ├── authSlice.ts
│   │   │   └── chatSlice.ts
│   │   └── store.ts
│   ├── themes/              # Theme management
│   │   ├── index.ts
│   │   ├── theme.ts         # Theme constants (JS/TS)
│   │   └── variables.css    # CSS variables
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   ├── App.tsx
│   ├── main.tsx
│   ├── index.css
│   └── vite-env.d.ts
├── .env.example
├── .gitignore
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── QUICKSTART.md
└── README.md
```

## 🛠️ Installation

### 1. Clone repository và cài dependencies

```bash
cd frontend
npm install
```

### 2. Cấu hình environment variables

Tạo file `.env` từ `.env.example`:

```bash
cp .env.example .env
```

Cập nhật các biến môi trường:

```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:6001
```

### 3. Chạy development server

```bash

npm run dev
```

Ứng dụng sẽ chạy tại: http://localhost:3000

## 📝 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload

# Production
npm run build        # Build for production
npm run preview      # Preview production build

# Type Checking
tsc --noEmit        # Check TypeScript types
```

## 🎯 Features

### ✅ Đã triển khai:

- 🔐 Authentication (Login/Register)
- 💬 Real-time messaging với Socket.io
- 📱 Responsive UI với Ant Design
- 🔄 Redux Toolkit state management
- 📊 TypeScript type safety
- 🎨 Modern UI/UX giống Messenger
- 🎨 **Theme Management**: CSS variables và theme constants
- 🚫 **No Inline Styles**: Tất cả styles được quản lý trong CSS files riêng biệt

### 🚧 Cần triển khai tiếp:

- [ ] Typing indicators
- [ ] Online/Offline status
- [ ] Read receipts
- [ ] File upload (images, videos, files)
- [ ] Emoji picker
- [ ] Message reactions
- [ ] Voice/Video call
- [ ] Group chat
- [ ] Search messages
- [ ] Notifications
- [ ] Dark mode

## 🔌 Backend Integration

Frontend cần kết nối với Laravel backend:

### API Endpoints cần có:

```
POST   /api/auth/login
POST   /api/auth/register
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/conversations
GET    /api/conversations/:id
POST   /api/conversations
GET    /api/conversations/:id/messages
POST   /api/conversations/:id/messages
POST   /api/upload

GET    /api/users/search
GET    /api/users/:id
```

### Socket.io Events:

**Client → Server:**
- `message:send` - Gửi tin nhắn
- `user:typing` - User đang gõ
- `message:read` - Đánh dấu đã đọc

**Server → Client:**
- `message:new` - Tin nhắn mới
- `message:updated` - Tin nhắn đã cập nhật
- `user:online` - User online
- `user:offline` - User offline
- `user:typing` - User đang gõ

## 🔧 Redux Store Structure

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  chat: {
    conversations: Conversation[],
    currentConversation: Conversation | null,
    messages: Record<number, Message[]>,
    onlineUsers: number[],
    typingUsers: Record<number, number[]>,
    loading: boolean,
    error: string | null
  }
}
```

## 🎨 Customization

### Theme Management

Dự án sử dụng CSS Variables để quản lý theme, cho phép dễ dàng thay đổi màu sắc và style toàn cục.

#### CSS Variables (`src/themes/variables.css`):

```css
:root {
  /* Primary Colors */
  --color-primary: #0084ff;
  --color-primary-hover: #0073e6;
  
  /* Background Colors */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f5f5f5;
  
  /* Text Colors */
  --color-text-primary: #000000;
  --color-text-secondary: #999999;
  
  /* Spacing */
  --spacing-lg: 16px;
  --spacing-xl: 24px;
  
  /* Border Radius */
  --radius-xl: 18px;
  
  /* ... và nhiều variables khác */
}
```

#### Theme Constants (`src/themes/theme.ts`):

```typescript
export const theme = {
  colors: {
    primary: '#0084ff',
    secondary: '#667eea',
    // ...
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    // ...
  },
  // ...
}
```

#### Sử dụng trong component:

```tsx
// Trong CSS file
.my-component {
  background: var(--color-primary);
  padding: var(--spacing-lg);
  border-radius: var(--radius-xl);
}

// Hoặc trong TypeScript
import { theme } from '@/themes'
const myColor = theme.colors.primary
```

### Thay đổi theme Ant Design:

Chỉnh sửa trong `src/main.tsx`:

```typescript
<ConfigProvider
  theme={{
    token: {
      colorPrimary: '#0084ff',  // Màu chủ đạo
      borderRadius: 18,         // Bo góc
      // Thêm các token khác...
    },
  }}
>
```

### Path Aliases:

Đã cấu hình path alias `@` để import dễ dàng hơn:

```typescript
import Component from '@/components/ChatHeader'
import { theme } from '@/themes'
import { authAPI } from '@/services/api'
```

## 📝 Code Style Guidelines

### CSS Organization:

- ✅ **Không sử dụng inline styles** (trừ trường hợp động hoặc cần thiết với Ant Design)
- ✅ Mỗi component có file CSS riêng với naming pattern: `index.css`
- ✅ Sử dụng BEM naming convention: `.component-name__element--modifier`
- ✅ Tất cả màu sắc được define trong `src/themes/variables.css`
- ✅ Sử dụng CSS variables cho spacing, colors, radius, etc.

### Component Structure:

```
ComponentName/
├── Index.tsx        # Component logic
└── index.css        # Component styles
```

### Example Component:

```tsx
// Index.tsx
import React from 'react'
import './index.css'

const MyComponent: React.FC = () => {
  return (
    <div className="my-component">
      <div className="my-component__header">
        <h1 className="my-component__title">Title</h1>
      </div>
    </div>
  )
}
```

```css
/* index.css */
.my-component {
  background: var(--color-bg-primary);
  padding: var(--spacing-lg);
}

.my-component__header {
  border-bottom: 1px solid var(--color-border-light);
}

.my-component__title {
  font-size: var(--font-size-xl);
  color: var(--color-text-primary);
}
```

## 📚 Documentation

- [React](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Redux Toolkit](https://redux-toolkit.js.org/)
- [Ant Design](https://ant.design/)
- [Socket.io](https://socket.io/docs/v4/)
- [Vite](https://vitejs.dev/)

## 🐛 Troubleshooting

### Port 3000 đã được sử dụng

Thay đổi port trong `vite.config.ts`:

```typescript
server: {
  port: 3001,
}
```

### CORS errors

Đảm bảo Laravel backend có cấu hình CORS đúng.

### Socket connection failed

Kiểm tra `VITE_SOCKET_URL` trong `.env` và đảm bảo Socket.io server đang chạy.

## 👥 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

MIT License

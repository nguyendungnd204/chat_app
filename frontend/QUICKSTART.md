# 🚀 Quick Start Guide

## Các bước đã hoàn thành:

✅ Cài đặt tất cả dependencies
✅ Cấu hình TypeScript + Vite
✅ Setup Redux Toolkit với typed hooks
✅ Tích hợp Ant Design với custom theme
✅ Tạo Socket.io hook cho real-time
✅ Xây dựng Auth pages (Login/Register)
✅ Xây dựng Chat UI (Sidebar, Header, MessageList, MessageInput)
✅ Thêm .gitignore và .env.example

## 📝 Để chạy project:

```bash
cd frontend
npm run dev
```

App đang chạy tại: **http://localhost:3000**

## 🔧 Cấu hình cần thiết:

### 1. Tạo file `.env`:
```bash
cp .env.example .env
```

Hoặc tạo thủ công:
```env
VITE_API_URL=http://localhost:8000/api
VITE_SOCKET_URL=http://localhost:6001
```

### 2. Backend Laravel cần implement:

#### API Endpoints:
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `GET /api/auth/me` - Lấy thông tin user
- `GET /api/conversations` - Danh sách hội thoại
- `GET /api/conversations/:id/messages` - Lấy tin nhắn
- `POST /api/conversations/:id/messages` - Gửi tin nhắn
- `POST /api/upload` - Upload file

#### Socket.io Server (Port 6001):
Events cần handle:
- `message:send` → `message:new`
- `user:typing` → broadcast typing status
- `message:read` → update read status
- `connection` → broadcast user:online
- `disconnect` → broadcast user:offline

## 📂 Cấu trúc project:

```
frontend/
├── src/
│   ├── features/
│   │   ├── auth/
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   └── authSlice.ts
│   │   └── chat/
│   │       ├── chatSlice.ts
│   │       └── components/
│   │           ├── ChatLayout.tsx
│   │           ├── ChatSidebar.tsx
│   │           ├── ChatHeader.tsx
│   │           ├── MessageList.tsx
│   │           └── MessageInput.tsx
│   ├── hooks/
│   │   ├── useSocket.ts
│   │   └── useRedux.ts
│   ├── services/
│   │   └── api.ts
│   ├── store/
│   │   └── store.ts
│   ├── types/
│   │   └── index.ts
│   └── main.tsx
└── README.md
```

## 🎯 Các tính năng cần làm tiếp:

### Frontend:
- [ ] Implement Emoji Picker
- [ ] File upload preview
- [ ] Image lightbox
- [ ] Typing indicator UI
- [ ] Notification system
- [ ] Message search
- [ ] Group chat UI

### Backend:
- [ ] Laravel API endpoints
- [ ] Laravel Reverb / Pusher / Socket.io server
- [ ] File upload handling
- [ ] Database migrations
- [ ] Authentication với Sanctum

## 💡 Tips:

### TypeScript strict mode:
Một số lỗi TypeScript có thể được bỏ qua tạm thời bằng cách comment `// @ts-ignore` trên dòng trước, nhưng nên fix đúng cách.

### Hot Module Replacement:
Vite tự động reload khi có thay đổi. Nếu có lỗi, check terminal và browser console.

### Redux DevTools:
Install extension để debug Redux state: https://github.com/reduxjs/redux-devtools

### Network requests:
Dùng browser DevTools → Network tab để debug API calls và Socket.io connections.

## 📞 Khi cần giúp đỡ:

1. Check README.md chi tiết hơn
2. Xem logs trong terminal
3. Kiểm tra browser console (F12)
4. Verify backend API đã chạy
5. Test Socket.io connection

---

**Status:** ✅ Frontend setup hoàn tất, sẵn sàng phát triển!

import { configureStore } from '@reduxjs/toolkit'
import chatReducer from './slice/chatSlice'
import authReducer from './slice/authSlice'

const store = configureStore({
  reducer: {
    chat: chatReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store

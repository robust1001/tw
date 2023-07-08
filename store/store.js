import {configureStore} from '@reduxjs/toolkit';
import authSlice from './features/authSlice';
import chatSlice from './features/chatSlice';
import userSlice from './features/userSlice';
import postsSlice from './features/postsSlice';
import tagsSlice from './features/tagsSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    posts: postsSlice,
    chat: chatSlice,
    user: userSlice,
    tags: tagsSlice,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
      immutableCheck: true,
    }),
});

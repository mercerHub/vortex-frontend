// redux/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/authSlice';

export const makeStore = () => {
  return configureStore({
    reducer: {
      auth: authReducer,
      // Add other reducers here
    },
    // Add middleware or other config as needed
  });
};

// Use this to create a store for server-side rendering
export const initializeStore = () => {
  return makeStore();
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
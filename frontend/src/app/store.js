import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage
import { apiSlice } from '../features/apiSlice';
import authReducer from '../features/authSlice';

// Persist configuration for auth slice
const persistConfig = {
  key: 'auth',
  storage,
  whitelist: ['token', 'username', 'role', 'form_ids', 'process_ids'], // Fields to persist
};

// Create persisted reducer
const persistedAuthReducer = persistReducer(persistConfig, authReducer);

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    auth: persistedAuthReducer, // Use persisted reducer instead
  },
  middleware: (getDefault) =>
    getDefault({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }).concat(apiSlice.middleware),
});

export const persistor = persistStore(store);
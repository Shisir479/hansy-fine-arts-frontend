import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { baseApi } from './api/baseApi';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import themeReducer from './slices/themeSlice';
import {
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const rootReducer = combineReducers({
  [baseApi.reducerPath]: baseApi.reducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'],
};

const persistedReducers = persistReducer(persistConfig, rootReducer);

// localStorage middleware
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  }
  
  return result;
};

export const store = configureStore({
  reducer: persistedReducers,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [REHYDRATE, PERSIST, REGISTER],
      },
    }).concat(baseApi.middleware, localStorageMiddleware),
});

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const persistor = persistStore(store);
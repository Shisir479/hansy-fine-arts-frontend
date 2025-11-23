import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';
import themeReducer from './slices/themeSlice';

// localStorage middleware
const localStorageMiddleware = (store: any) => (next: any) => (action: any) => {
  const result = next(action);
  
  // Save cart to localStorage after any cart action
  if (action.type?.startsWith('cart/')) {
    const state = store.getState();
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(state.cart));
    }
  }
  
  return result;
};

export const makeStore = () => {
  return configureStore({
    reducer: {
      cart: cartReducer,
      wishlist: wishlistReducer,
      theme: themeReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
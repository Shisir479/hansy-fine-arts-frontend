import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { finerworksApi } from "./api/finerworksApi";
import authReducer from "./slices/authSlice";
import cartReducer from "./slices/cartSlice";
import wishlistReducer from "./slices/wishlistSlice";
import themeReducer from "./slices/themeSlice";

import {
  PERSIST,
  persistReducer,
  persistStore,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import { printfulApi } from "./api/printfulApi";

const rootReducer = combineReducers({
  [finerworksApi.reducerPath]: finerworksApi.reducer,
  [printfulApi.reducerPath]: printfulApi.reducer,
  auth: authReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
  theme: themeReducer,
});

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["auth", "cart", "wishlist", "theme"],
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [PERSIST, REHYDRATE, REGISTER],
        },
      }).concat(finerworksApi.middleware, printfulApi.middleware),
  });
};

export const store = makeStore();
export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type AppStore = ReturnType<typeof makeStore>;
// We export RootState based on the combined reducer type to ensure proper typing for selectors
export type RootState = ReturnType<typeof rootReducer>; 
export type AppDispatch = AppStore["dispatch"];


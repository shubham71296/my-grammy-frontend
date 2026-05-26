import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../features/ui/uiSlice";
import authReducer from "../features/auth/authSlice";
import dataCountReducer from "../features/dataCountSlice";
import cartReducer from "../features/cartSlice";
import { catalogApi } from "../features/api/catalogApi";
import { adminApi } from "../features/api/adminApi";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    auth: authReducer,
    dataCount: dataCountReducer,
    cart: cartReducer,
    [catalogApi.reducerPath]: catalogApi.reducer,
    [adminApi.reducerPath]: adminApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      catalogApi.middleware,
      adminApi.middleware
    ),
});

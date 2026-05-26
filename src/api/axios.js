import axios from "axios";
import { store } from "../store";
import { logout } from "../features/auth/authSlice";
import { normalizeApiBase } from "../utils/apiBase";

const api = axios.create({
  baseURL: normalizeApiBase(import.meta.env.VITE_API_BASE_URL),
});

// 🔹 Request Interceptor (Attach Token)
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔹 Response Interceptor (Handle Expiry)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;

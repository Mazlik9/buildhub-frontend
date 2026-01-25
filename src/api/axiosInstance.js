// src/api/axiosInstance.js
import axios from 'axios';
import {
  getAccessToken,
  isAccessTokenExpiredSoon,
  clearAuthTokens,
  setAuthTokens,
  getRefreshToken,
} from '@/shared/lib/authTokens';
import { refreshToken } from './services';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
});

// ================== Очередь для запросов ==================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// ================= Request interceptor ==================
api.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) return config;

    let token = getAccessToken();

    // Если токен скоро истечёт
    if (token && isAccessTokenExpiredSoon()) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newToken = await refreshToken(); // из services.js
          token = newToken;
          setAuthTokens(newToken, getRefreshToken()); // обновляем локально
          processQueue(null, newToken);
        } catch (err) {
          processQueue(err, null);
          clearAuthTokens();
          token = null;
        } finally {
          isRefreshing = false;
        }
      } else {
        // Ждём пока текущий refresh завершится
        token = await new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        });
      }
    }

    if (token) config.headers.Authorization = `Bearer ${token}`;

    return config;
  },
  (error) => Promise.reject(error)
);

// ================= Response interceptor ==================
// Можно ловить 401 ошибки, если нужно, и очищать токены
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      clearAuthTokens();
    }
    return Promise.reject(error);
  }
);

export default api;

// src/api/axiosInstance.js
import axios from 'axios';
import {
  getAccessToken,
  getRefreshToken,
  isAccessTokenExpiredSoon,
} from '@/shared/lib/authTokens';
import { refreshAccessToken } from './refreshApi';

const API_BASE =
  `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`;

const AUTO_REFRESH =
  String(import.meta.env.VITE_AUTH_AUTO_REFRESH).toLowerCase() === 'true';

const api = axios.create({
  baseURL: API_BASE,
  timeout: 15000,
});

/* ================= Refresh queue ================= */

let isRefreshing = false;
let refreshQueue = [];

const resolveQueue = (error, token = null) => {
  refreshQueue.forEach(promise => {
    if (error) promise.reject(error);
    else promise.resolve(token);
  });
  refreshQueue = [];
};

const enqueueRefresh = () =>
  new Promise((resolve, reject) => refreshQueue.push({ resolve, reject }));

/* ================= Request interceptor ================= */

api.interceptors.request.use(
  async (config) => {
    if (config.skipAuth) return config;

    let access = getAccessToken();
    const refresh = getRefreshToken();

    // Если auto-refresh выключен — просто подставляем access если есть
    if (!AUTO_REFRESH) {
      if (access) config.headers.Authorization = `Bearer ${access}`;
      return config;
    }

    // ✅ Ключевая правка:
    // Если access отсутствует, но есть refresh — пробуем обновить перед запросом
    const shouldRefresh =
      !!refresh && (!access || isAccessTokenExpiredSoon());

    if (shouldRefresh) {
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const newAccess = await refreshAccessToken();
          access = newAccess;
          resolveQueue(null, newAccess);
        } catch (err) {
          resolveQueue(err, null);
          throw err;
        } finally {
          isRefreshing = false;
        }
      } else {
        access = await enqueueRefresh();
      }
    }

    if (access) {
      config.headers.Authorization = `Bearer ${access}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* ================= Response interceptor ================= */

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Сеть/нет ответа
    if (!error?.response) return Promise.reject(error);

    // Если auto-refresh выключен — ничего не делаем
    if (!AUTO_REFRESH) return Promise.reject(error);

    const status = error.response.status;
    const originalRequest = error.config;

    // Не пытаемся рефрешить запросы без auth
    if (originalRequest?.skipAuth) return Promise.reject(error);

    // Retry-логика на 401 (на случай если access протух "в моменте")
    if (status === 401 && !originalRequest?._retry) {
      originalRequest._retry = true;

      const refresh = getRefreshToken();
      if (!refresh) return Promise.reject(error);

      try {
        const newAccess = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return api(originalRequest);
      } catch (refreshErr) {
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

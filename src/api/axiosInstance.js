// src/api/axiosInstance.js
import axios from 'axios';
import {
  getAccessToken,
  isAccessTokenExpiredSoon,
} from '@/shared/lib/authTokens';
import { refreshAccessToken } from './refreshApi';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

/* ================= Request interceptor ================= */

api.interceptors.request.use(
  async config => {
    if (config.skipAuth) return config;

    let token = getAccessToken();

    if (token && isAccessTokenExpiredSoon()) {
      if (!isRefreshing) {
        isRefreshing = true;

        try {
          const newAccessToken = await refreshAccessToken();
          token = newAccessToken;
          resolveQueue(null, newAccessToken);
        } catch (err) {
          resolveQueue(err, null);
          throw err;
        } finally {
          isRefreshing = false;
        }
      } else {
        token = await new Promise((resolve, reject) => {
          refreshQueue.push({ resolve, reject });
        });
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

/* ================= Response interceptor ================= */

api.interceptors.response.use(
  response => response,
  error => {
    // ❗️ НЕ чистим токены здесь
    return Promise.reject(error);
  }
);

export default api;

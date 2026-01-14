// src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_VERSION,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Флаг, чтобы не зациклиться при обновлении
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    error ? prom.reject(error) : prom.resolve(token);
  });
  failedQueue = [];
};

// 1. Добавляем ТОЛЬКО access-токен (если он есть)
api.interceptors.request.use((config) => {
  const accessToken = localStorage.getItem('accessToken');

  // Добавляем заголовок ТОЛЬКО если токен существует и это не запрос на refresh
  if (accessToken && !config.url.includes('/refresh')) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
}, (error) => Promise.reject(error));

// 2. Интерсептор ответа — обработка 401 и автоматический refresh
api.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Ждём завершения текущего рефреша
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Запрос на обновление токена (используем refresh)
        const refresh = localStorage.getItem('refreshToken');
        if (!refresh) {
          throw new Error('Нет refresh-токена');
        }

        const response = await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}/user/token/refresh/`,
          { refresh }
        );

        const { access, refresh: newRefresh } = response.data;

        // Сохраняем новые токены
        localStorage.setItem('accessToken', access);
        if (newRefresh) {
          localStorage.setItem('refreshToken', newRefresh);
        }

        // Обновляем очередь
        processQueue(null, access);

        // Повторяем исходный запрос
        originalRequest.headers.Authorization = `Bearer ${access}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);

        // Refresh не удался → полностью разлогиниваем
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        toast.error('Сессия истекла. Пожалуйста, войдите заново.');

        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
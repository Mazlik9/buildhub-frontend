// src/api/axiosInstance.js
import axios from 'axios';
import { toast } from 'sonner';
import { AUTH_ENDPOINTS } from './endpoints';

const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
  withCredentials: false,
});

class TokenManager {
  constructor() {
    this.isRefreshing = false;
    this.failedQueue = [];
  }

  getAccessToken() {
    return localStorage.getItem('accessToken');
  }

  getRefreshToken() {
    return localStorage.getItem('refreshToken');
  }

  setTokens(access, refresh) {
    localStorage.setItem('accessToken', access);
    if (refresh) {
      localStorage.setItem('refreshToken', refresh);
    }
  }

  clearTokens() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('activeActor');
    localStorage.removeItem('activeActorId');
  }

  processQueue(error, token = null) {
    this.failedQueue.forEach(prom => {
      if (error) {
        prom.reject(error);
      } else {
        prom.resolve(token);
      }
    });
    this.failedQueue = [];
  }

  // Проверка, истек ли токен
  isTokenExpired() {
    const token = this.getAccessToken();
    if (!token) return true;
    
    try {
      // Декодируем JWT токен
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const payload = JSON.parse(window.atob(base64));
      
      // Проверяем время истечения (exp в секундах)
      const currentTime = Math.floor(Date.now() / 1000);
      const bufferTime = 30; // 30 секунд буфер
      
      return currentTime >= payload.exp - bufferTime;
    } catch (error) {
      console.error('Ошибка при проверке токена:', error);
      return true;
    }
  }

  async refreshToken() {
    try {
      const refreshToken = this.getRefreshToken();
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }

      // Используем чистый axios без интерцепторов для refresh запроса
      // Важно: не используем наш api instance, чтобы избежать рекурсии
      const response = await axios({
        method: 'POST',
        url: AUTH_ENDPOINTS.REFRESH_TOKEN,
        data: { refresh: refreshToken },
        headers: {
          'Content-Type': 'application/json',
        },
        baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
        timeout: 10000,
        withCredentials: false,
      });

      // Django SimpleJWT возвращает только access токен при refresh
      const { access } = response.data;
      
      // Сохраняем только access токен, refresh остается тот же
      this.setTokens(access, refreshToken);
      
      console.log('Токен успешно обновлен');
      return access;
    } catch (error) {
      console.error('Ошибка обновления токена:', error);
      this.clearTokens();
      
      // Показываем уведомление только если это не страница логина
      const currentPath = window.location.pathname;
      const isLoginPage = currentPath.includes('/login') || currentPath.includes('/auth');
      
      if (!isLoginPage && error.response?.status !== 401) {
        toast.error('Сессия истекла. Пожалуйста, войдите заново.', {
          duration: 5000,
          onAutoClose: () => {
            window.location.href = `/login?redirect=${encodeURIComponent(currentPath)}`;
          }
        });
      }
      
      throw error;
    }
  }

  // Валидация токена
  async validateToken() {
    const token = this.getAccessToken();
    if (!token) return false;

    try {
      await axios({
        method: 'POST',
        url: AUTH_ENDPOINTS.VERIFY_TOKEN,
        data: { token },
        baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
        skipAuth: true
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  // Добавление токена в черный список (при логауте)
  async blacklistToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) return;

    try {
      await axios({
        method: 'POST',
        url: AUTH_ENDPOINTS.BLACKLIST_TOKEN,
        data: { refresh: refreshToken },
        baseURL: `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`,
        skipAuth: true
      });
    } catch (error) {
      console.warn('Ошибка при добавлении токена в черный список:', error);
    } finally {
      this.clearTokens();
    }
  }
}

const tokenManager = new TokenManager();

// Интерсептор запросов
api.interceptors.request.use(
  (config) => {
    // Пропускаем запросы с флагом skipAuth
    if (config.skipAuth) {
      delete config.skipAuth;
      return config;
    }

    // Для мультипарт запросов устанавливаем правильный Content-Type
    if (config.data instanceof FormData) {
      config.headers['Content-Type'] = 'multipart/form-data';
    }

    const accessToken = tokenManager.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      
      // Если токен скоро истечет, пытаемся обновить его заранее
      if (tokenManager.isTokenExpired() && !config._retry) {
        console.log('Токен скоро истечет, пытаемся обновить...');
        // Помечаем запрос, чтобы избежать дублирования
        config._retry = true;
        
        // В фоновом режиме обновляем токен
        if (!tokenManager.isRefreshing) {
          tokenManager.refreshToken().catch(() => {
            // Игнорируем ошибки в фоне
          });
        }
      }
    }

    // Добавляем метку времени запроса для дебага
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, {
        data: config.data,
        headers: config.headers
      });
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Интерсептор ответов
api.interceptors.response.use(
  (response) => {
    // Логирование успешных ответов в dev режиме
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url}`, {
        status: response.status,
        data: response.data
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Логирование ошибок в dev режиме
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${originalRequest?.method?.toUpperCase()} ${originalRequest?.url}`, {
        status: error.response?.status,
        data: error.response?.data,
        config: originalRequest
      });
    }

    // Проверяем, что это 401 ошибка и запрос еще не повторялся
    // Исключаем запросы на обновление токена, логин и регистрацию
    const url = originalRequest?.url || '';
    const isRefreshRequest = url.includes('/token/jwt/refresh');
    const isLoginRequest = url.includes('/user/login');
    const isRegistrationRequest = url.includes('/user/registration');
    const isVerifyRequest = url.includes('/token/jwt/verify');
    const isBlacklistRequest = url.includes('/token/jwt/blacklist');
    
    if (error.response?.status === 401 && 
        !originalRequest._retry &&
        !isRefreshRequest &&
        !isLoginRequest &&
        !isRegistrationRequest &&
        !isVerifyRequest &&
        !isBlacklistRequest) {
      
      originalRequest._retry = true;

      // Если уже идет обновление токена, ставим запрос в очередь
      if (tokenManager.isRefreshing) {
        return new Promise((resolve, reject) => {
          tokenManager.failedQueue.push({ 
            resolve: (token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            }, 
            reject 
          });
        });
      }

      tokenManager.isRefreshing = true;

      try {
        const newAccessToken = await tokenManager.refreshToken();
        tokenManager.processQueue(null, newAccessToken);
        
        // Обновляем заголовок и повторяем запрос
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        tokenManager.processQueue(refreshError, null);
        
        // Если не удалось обновить токен, делаем полный логаут
        await tokenManager.blacklistToken();
        
        return Promise.reject(refreshError);
      } finally {
        tokenManager.isRefreshing = false;
      }
    }

    // Обработка других ошибок
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case 400:
          if (data.non_field_errors) {
            toast.error(data.non_field_errors.join(', '));
          } else if (typeof data === 'object') {
            // Показываем первую ошибку из объекта
            const firstError = Object.values(data)[0];
            if (Array.isArray(firstError)) {
              toast.error(firstError[0]);
            } else if (typeof firstError === 'string') {
              toast.error(firstError);
            }
          }
          break;
          
        case 403:
          toast.error('Доступ запрещен');
          // Редирект на главную или страницу логина
          if (!window.location.pathname.includes('/login')) {
            setTimeout(() => {
              window.location.href = '/';
            }, 2000);
          }
          break;
          
        case 404:
          // Не показываем тост для 404 ошибок
          break;
          
        case 429:
          toast.error('Слишком много запросов. Пожалуйста, попробуйте позже.');
          break;
          
        case 500:
          toast.error('Ошибка сервера. Пожалуйста, попробуйте позже.');
          break;
          
        default:
          if (status >= 500) {
            toast.error('Ошибка сервера. Пожалуйста, попробуйте позже.');
          } else if (data.detail) {
            toast.error(data.detail);
          }
      }
    } else if (error.request) {
      // Ошибка сети
      toast.error('Нет соединения с сервером. Проверьте подключение к интернету.');
    } else {
      // Ошибка настройки запроса
      console.error('Ошибка настройки запроса:', error.message);
    }

    return Promise.reject(error);
  }
);

// Вспомогательные функции для работы с токенами
export const setAuthTokens = (accessToken, refreshToken) => {
  tokenManager.setTokens(accessToken, refreshToken);
};

export const clearAuthTokens = () => {
  tokenManager.clearTokens();
};

export const isAuthenticated = () => {
  const hasTokens = !!tokenManager.getAccessToken() && !!tokenManager.getRefreshToken();
  if (!hasTokens) return false;
  
  // Дополнительно проверяем, не истек ли токен
  return !tokenManager.isTokenExpired();
};

export const validateToken = () => tokenManager.validateToken();
export const blacklistToken = () => tokenManager.blacklistToken();
export const getAccessToken = () => tokenManager.getAccessToken();
export const getRefreshToken = () => tokenManager.getRefreshToken();
export const isTokenExpired = () => tokenManager.isTokenExpired();

// Функция для безопасного логаута
export const logout = async (showToast = true) => {
  try {
    // Пытаемся добавить токен в черный список
    await tokenManager.blacklistToken();
    
    if (showToast) {
      toast.success('Вы успешно вышли из системы');
    }
  } catch (error) {
    // В любом случае очищаем токены локально
    tokenManager.clearTokens();
  }
  
  // Редирект на страницу логина
  setTimeout(() => {
    window.location.href = '/login';
  }, 1000);
};

// Функция для проверки и обновления токена при запуске приложения
export const initializeAuth = async () => {
  const accessToken = tokenManager.getAccessToken();
  const refreshToken = tokenManager.getRefreshToken();
  
  if (!accessToken || !refreshToken) {
    return false;
  }
  
  // Проверяем, не истек ли токен
  if (tokenManager.isTokenExpired()) {
    try {
      await tokenManager.refreshToken();
      return true;
    } catch (error) {
      console.log('Не удалось обновить токен при инициализации:', error);
      return false;
    }
  }
  
  return true;
};

export default api;
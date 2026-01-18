// src/api/services.js
import api from './axiosInstance';
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  USER_SELF_ENDPOINTS,
  COMPANY_ENDPOINTS,
  AD_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  ACTOR_ENDPOINTS,
} from './endpoints';

// ==================== АВТЕНТИФИКАЦИЯ И ПОЛЬЗОВАТЕЛИ ====================
// Все функции из authApi.js переехали сюда

/**
 * Сервис для работы с JWT токенами
 */
export const jwtService = {
  /**
   * Получение JWT токена (логин через JWT)
   * @param {Object} credentials - {username, password} или {email, password}
   * @returns {Promise<{access: string, refresh: string}>}
   */
  getToken: async (credentials) => {
    const response = await api.post(
      AUTH_ENDPOINTS.GET_TOKEN, 
      credentials, 
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Обновление JWT токена
   * @returns {Promise<{access: string, refresh?: string}>}
   */
  refreshToken: async () => {
    const refresh = localStorage.getItem('refreshToken');
    if (!refresh) {
      throw new Error('Нет refresh-токена');
    }

    const response = await api.post(
      AUTH_ENDPOINTS.REFRESH_TOKEN, 
      { refresh }, 
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Верификация JWT токена
   * @param {string} token - JWT токен для проверки
   * @returns {Promise<boolean>}
   */
  verifyToken: async (token) => {
    const response = await api.post(
      AUTH_ENDPOINTS.VERIFY_TOKEN, 
      { token }, 
      { skipAuth: true }
    );
    return response.status === 200;
  },

  /**
   * Добавление токена в черный список
   * @param {string} refreshToken - Refresh токен для блокировки
   * @returns {Promise<void>}
   */
  blacklistToken: async (refreshToken) => {
    await api.post(
      AUTH_ENDPOINTS.BLACKLIST_TOKEN, 
      { refresh: refreshToken }, 
      { skipAuth: true }
    );
  },
};

/**
 * Сервис для работы с пользователями (регистрация, авторизация)
 * Функции из authApi.js переименованы для единообразия
 */
export const authService = {
  /**
   * Регистрация пользователя
   * @param {Object} userData - {email, full_name, password, password2}
   * @returns {Promise<{email: string, full_name: string, access?: string, refresh?: string}>}
   */
  register: async ({ email, full_name, password, password2 }) => {
    const response = await api.post(
      USER_ENDPOINTS.REGISTRATION, 
      { email, full_name, password, password2 }, 
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Авторизация (логин) пользователя
   * @param {Object} credentials - {login, password}
   * @returns {Promise<{email: string, phone?: string, full_name: string, access?: string, refresh?: string}>}
   */
  login: async ({ login, password }) => {
    const response = await api.post(
      USER_ENDPOINTS.LOGIN, 
      { login, password }, 
      { skipAuth: true }
    );
    return response.data;
  },

  /**
   * Выход пользователя
   * @returns {Promise<void>}
   */
  logout: async () => {
    try {
      await api.post(USER_ENDPOINTS.LOGOUT, {}, { skipAuth: true });
    } catch (error) {
      console.warn('Ошибка при выходе', error);
    }
  },

  /**
   * Комбинированный логин с получением JWT токена
   * @param {Object} credentials - {login, password}
   * @returns {Promise<{user: Object, tokens: {access: string, refresh: string}}>}
   */
  loginWithJWT: async (credentials) => {
    try {
      // Пробуем получить JWT токен
      const jwtResponse = await jwtService.getToken({
        username: credentials.login, // предполагаем, что login - это username/email
        password: credentials.password,
      });

      // Логинимся через user endpoint для получения данных пользователя
      const userResponse = await authService.login(credentials);

      return {
        user: userResponse,
        tokens: {
          access: jwtResponse.access,
          refresh: jwtResponse.refresh,
        },
      };
    } catch (jwtError) {
      // Если JWT эндпоинт не работает, пробуем обычный логин
      console.warn('JWT логин не сработал, используем обычный:', jwtError);
      const userResponse = await authService.login(credentials);
      return {
        user: userResponse,
        tokens: {
          access: userResponse.access || '',
          refresh: userResponse.refresh || '',
        },
      };
    }
  },
};

/**
 * Сервис для работы с текущим пользователем (user-self)
 */
export const userSelfService = {
  /**
   * Получение профиля текущего пользователя
   * @returns {Promise<Object>}
   */
  getProfile: async () => {
    const response = await api.get(USER_SELF_ENDPOINTS.GET_PROFILE);
    return response.data;
  },

  /**
   * Обновление профиля текущего пользователя
   * @param {Object} data - Данные для обновления
   * @returns {Promise<Object>}
   */
  updateProfile: async (data) => {
    const response = await api.patch(USER_SELF_ENDPOINTS.UPDATE_PROFILE, data);
    return response.data;
  },

  /**
   * Смена аватара пользователя
   * @param {FormData} formData - FormData с файлом аватара
   * @returns {Promise<Object>}
   */
  changeAvatar: async (formData) => {
    const response = await api.patch(
      USER_SELF_ENDPOINTS.CHANGE_AVATAR, 
      formData, 
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  /**
   * Смена пароля пользователя
   * @param {Object} data - {current_password, new_password, confirm_password}
   * @returns {Promise<Object>}
   */
  changePassword: async (data) => {
    const response = await api.post(USER_SELF_ENDPOINTS.CHANGE_PASSWORD, data);
    return response.data;
  },

  /**
   * Получение пользователя по slug
   * @param {string} slug - Slug пользователя
   * @returns {Promise<Object>}
   */
  getBySlug: async (slug) => {
    const response = await api.get(USER_ENDPOINTS.GET_BY_SLUG(slug));
    return response.data;
  },
};

// ==================== КОМПАНИИ ====================
export const companyService = {
  /**
   * Создание компании
   * @param {Object} data - Данные компании
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post(COMPANY_ENDPOINTS.CREATE, data);
    return response.data;
  },

  /**
   * Получение информации о компании по slug
   * @param {string} slug - Slug компании
   * @returns {Promise<Object>}
   */
  getBySlug: async (slug) => {
    const response = await api.get(COMPANY_ENDPOINTS.GET_BY_SLUG(slug));
    return response.data;
  },

  /**
   * Обновление компании
   * @param {string} slug - Slug компании
   * @param {Object} data - Данные для обновления
   * @returns {Promise<Object>}
   */
  update: async (slug, data) => {
    const response = await api.patch(COMPANY_ENDPOINTS.UPDATE(slug), data);
    return response.data;
  },

  /**
   * Удаление компании
   * @param {string} slug - Slug компании
   * @returns {Promise<void>}
   */
  delete: async (slug) => {
    await api.delete(COMPANY_ENDPOINTS.DELETE(slug));
  },

  /**
   * Обновление логотипа компании
   * @param {string} slug - Slug компании
   * @param {FormData} formData - FormData с файлом логотипа
   * @returns {Promise<Object>}
   */
  updateLogo: async (slug, formData) => {
    const response = await api.patch(
      COMPANY_ENDPOINTS.UPDATE_LOGO(slug), 
      formData, 
      {
        headers: { 'Content-Type': 'multipart/form-data' }
      }
    );
    return response.data;
  },

  /**
   * Получение моих компаний
   * @returns {Promise<Object[]>}
   */
  getMyCompanies: async () => {
    const response = await api.get(COMPANY_ENDPOINTS.MY_COMPANIES);
    return response.data;
  },
};

// ==================== ОБЪЯВЛЕНИЯ ====================
export const adService = {
  /**
   * Создание объявления
   * @param {Object} data - Данные объявления
   * @returns {Promise<Object>}
   */
  create: async (data) => {
    const response = await api.post(AD_ENDPOINTS.CREATE, data);
    return response.data;
  },
};

// ==================== КАТЕГОРИИ ====================
export const categoryService = {
  /**
   * Получение списка категорий
   * @param {Object} params - Параметры запроса (пагинация, фильтры)
   * @returns {Promise<Object[]>}
   */
  getAll: async (params = {}) => {
    const response = await api.get(CATEGORY_ENDPOINTS.LIST, { params });
    return response.data;
  },

  /**
   * Получение деталей категории по slug
   * @param {string} slug - Slug категории
   * @returns {Promise<Object>}
   */
  getBySlug: async (slug) => {
    const response = await api.get(CATEGORY_ENDPOINTS.DETAIL(slug));
    return response.data;
  },
};

// ==================== АКТОРЫ (РОЛИ) ====================
export const actorService = {
  /**
   * Получение всех акторов пользователя
   * @returns {Promise<Object[]>}
   */
  getAll: async () => {
    const response = await api.get(ACTOR_ENDPOINTS.LIST);
    return response.data;
  },

  /**
   * Получение активного актора
   * @returns {Promise<Object>}
   */
  getActive: async () => {
    const response = await api.get(ACTOR_ENDPOINTS.GET_ACTIVE);
    return response.data;
  },

  /**
   * Смена активного актора
   * @param {string|number} actorId - ID актора
   * @returns {Promise<Object>}
   */
  setActive: async (actorId) => {
    const response = await api.post(
      ACTOR_ENDPOINTS.SET_ACTIVE, 
      { actor_id: actorId }
    );
    return response.data;
  },
};

// ==================== ДЛЯ ОБРАТНОЙ СОВМЕСТИМОСТИ ====================
// Экспорт функций с именами из authApi.js для существующего кода
export const registerUser = authService.register;
export const loginUser = authService.login;
export const logoutUser = authService.logout;

// ==================== КОМБИНИРОВАННЫЙ ЭКСПОРТ ====================
/**
 * Объект со всеми сервисами для удобного импорта
 */
export const apiServices = {
  // Аутентификация
  jwt: jwtService,
  auth: authService,
  userSelf: userSelfService,
  
  // Основные сервисы
  companies: companyService,
  ads: adService,
  categories: categoryService,
  actors: actorService,
  
  // Для обратной совместимости
  registerUser,
  loginUser,
  logoutUser,
};

// Дефолтный экспорт для удобства
export default apiServices;
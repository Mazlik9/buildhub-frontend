// src/api/endpoints.js

/**
 * Базовый API URL
 */
const BASE_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_VERSION;

/**
 * Группа: Auth - Аутентификация и авторизация (JWT токены)
 */
export const AUTH_ENDPOINTS = {
  // POST /token/jwt/ - получение JWT токена
  GET_TOKEN: `${BASE_URL}/token/jwt/`,
  
  // POST /token/jwt/blacklist/ - добавление токена в черный список
  BLACKLIST_TOKEN: `${BASE_URL}/token/jwt/blacklist/`,
  
  // POST /token/jwt/refresh/ - обновление JWT токена
  REFRESH_TOKEN: `${BASE_URL}/token/jwt/refresh/`,
  
  // POST /token/jwt/verify/ - верификация JWT токена
  VERIFY_TOKEN: `${BASE_URL}/token/jwt/verify/`,
};

/**
 * Группа: User - Пользователи (регистрация, авторизация, профиль)
 */
export const USER_ENDPOINTS = {
  // GET /user/{slug}/ - получение профиля пользователя по slug
  GET_BY_SLUG: (slug) => `${BASE_URL}/user/${slug}/`,
  
  // POST /user/login/ - авторизация пользователя
  LOGIN: `${BASE_URL}/user/login/`,
  
  // POST /user/logout/ - выход пользователя
  LOGOUT: `${BASE_URL}/user/logout/`,
  
  // POST /user/registration/ - регистрация пользователя
  REGISTRATION: `${BASE_URL}/user/registration/`,
};

/**
 * Группа: User-Self - Запросы для своего пользователя
 */
export const USER_SELF_ENDPOINTS = {
  // GET /user-self/ - получение профиля текущего пользователя
  GET_PROFILE: `${BASE_URL}/user-self/`,
  
  // PATCH /user-self/ - обновление профиля текущего пользователя
  UPDATE_PROFILE: `${BASE_URL}/user-self/`,
  
  // PATCH /user-self/avatar/ - смена аватара пользователя
  CHANGE_AVATAR: `${BASE_URL}/user-self/avatar/`,
  
  // POST /user-self/change-password/ - смена пароля пользователя
  CHANGE_PASSWORD: `${BASE_URL}/user-self/change-password/`,
};

/**
 * Группа: Company - Компании
 */
export const COMPANY_ENDPOINTS = {
  // POST /companies/ - создание компании
  CREATE: `${BASE_URL}/companies/`,
  
  // GET /companies/{slug}/ - информация о компании
  GET_BY_SLUG: (slug) => `${BASE_URL}/companies/${slug}/`,
  
  // DELETE /companies/{slug}/delete/ - удаление компании
  DELETE: (slug) => `${BASE_URL}/companies/${slug}/delete/`,
  
  // PATCH /companies/{slug}/logo/ - обновление логотипа компании
  UPDATE_LOGO: (slug) => `${BASE_URL}/companies/${slug}/logo/`,
  
  // PATCH /companies/{slug}/update/ - обновление компании
  UPDATE: (slug) => `${BASE_URL}/companies/${slug}/update/`,
  
  // GET /companies/my/ - мои компании
  MY_COMPANIES: `${BASE_URL}/companies/my/`,
};

/**
 * Группа: Ad - Объявления
 */
export const AD_ENDPOINTS = {
  // POST /ads/ - создание объявления
  CREATE: `${BASE_URL}/ads/`,
};

/**
 * Группа: Category - Категории объявлений
 */
export const CATEGORY_ENDPOINTS = {
  // GET /categories/ - список категорий
  LIST: `${BASE_URL}/categories/`,
  
  // GET /categories/{slug}/ - детали категории
  DETAIL: (slug) => `${BASE_URL}/categories/${slug}/`,
};

/**
 * Группа: Actor - Акторы (группы/роли пользователя)
 */
export const ACTOR_ENDPOINTS = {
  // GET /actors/ - получение всех акторов пользователя
  LIST: `${BASE_URL}/actors/`,
  
  // GET /actors/active/ - получение активного актора
  GET_ACTIVE: `${BASE_URL}/actors/active/`,
  
  // POST /actors/set-active/ - смена активного актора
  SET_ACTIVE: `${BASE_URL}/actors/set-active/`,
};

/**
 * Общие утилиты для работы с эндпоинтами
 */
export const API_UTILS = {
  buildUrl: (baseUrl, params = {}) => {
    const url = new URL(baseUrl);
    Object.keys(params).forEach(key => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, params[key]);
      }
    });
    return url.toString();
  },
  
  paginate: (url, page = 1, pageSize = 20) => {
    return `${url}?page=${page}&page_size=${pageSize}`;
  },
  
  sort: (url, sortBy, sortOrder = 'asc') => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}ordering=${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
  },
};

/**
 * Экспорт всех групп для удобного импорта
 */
export default {
  AUTH: AUTH_ENDPOINTS,
  USER: USER_ENDPOINTS,
  USER_SELF: USER_SELF_ENDPOINTS,
  COMPANY: COMPANY_ENDPOINTS,
  AD: AD_ENDPOINTS,
  CATEGORY: CATEGORY_ENDPOINTS,
  ACTOR: ACTOR_ENDPOINTS,
  UTILS: API_UTILS,
};
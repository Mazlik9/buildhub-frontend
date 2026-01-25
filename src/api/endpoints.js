const BASE_URL = import.meta.env.VITE_API_BASE_URL + import.meta.env.VITE_API_VERSION;

/**
 * Auth (JWT)
 */
export const AUTH_ENDPOINTS = {
  GET_TOKEN: `${BASE_URL}/token/jwt/`,
  REFRESH_TOKEN: `${BASE_URL}/token/jwt/refresh/`,
  VERIFY_TOKEN: `${BASE_URL}/token/jwt/verify/`,
  BLACKLIST_TOKEN: `${BASE_URL}/token/jwt/blacklist/`,
};

/**
 * User
 */
export const USER_ENDPOINTS = {
  LOGIN: `${BASE_URL}/user/login/`,
  LOGOUT: `${BASE_URL}/user/logout/`,
  REGISTRATION: `${BASE_URL}/user/registration/`,
  GET_BY_SLUG: slug => `${BASE_URL}/user/${slug}/`,
};

/**
 * User Self
 */
export const USER_SELF_ENDPOINTS = {
  GET_PROFILE: `${BASE_URL}/user-self/`,
  UPDATE_PROFILE: `${BASE_URL}/user-self/`,
  CHANGE_AVATAR: `${BASE_URL}/user-self/avatar/`,
  CHANGE_PASSWORD: `${BASE_URL}/user-self/change-password/`,
};

/**
 * Company
 */
export const COMPANY_ENDPOINTS = {
  CREATE: `${BASE_URL}/companies/`,
  GET_BY_SLUG: slug => `${BASE_URL}/companies/${slug}/`,
  DELETE: slug => `${BASE_URL}/companies/${slug}/delete/`,
  UPDATE_LOGO: slug => `${BASE_URL}/companies/${slug}/logo/`,
  UPDATE: slug => `${BASE_URL}/companies/${slug}/update/`,
  MY_COMPANIES: `${BASE_URL}/companies/my/`,
};

/**
 * Ads
 */
export const AD_ENDPOINTS = {
  CREATE: `${BASE_URL}/ads/`,
};

/**
 * Categories
 */
export const CATEGORY_ENDPOINTS = {
  LIST: `${BASE_URL}/categories/`,
  DETAIL: slug => `${BASE_URL}/categories/${slug}/`,
};

/**
 * Actors
 */
export const ACTOR_ENDPOINTS = {
  LIST: `${BASE_URL}/actors/`,
  GET_ACTIVE: `${BASE_URL}/actors/active/`,
  SET_ACTIVE: `${BASE_URL}/actors/set-active/`,
};

/**
 * Utilities
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
  paginate: (url, page = 1, pageSize = 20) => `${url}?page=${page}&page_size=${pageSize}`,
  sort: (url, sortBy, sortOrder = 'asc') => {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}ordering=${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
  },
};

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

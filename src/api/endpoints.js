// src/api/endpoints.js

/**
 * Auth (JWT)
 */
export const AUTH_ENDPOINTS = {
  GET_TOKEN: `/token/jwt/`,
  REFRESH_TOKEN: `/token/jwt/refresh/`,
  VERIFY_TOKEN: `/token/jwt/verify/`,
  BLACKLIST_TOKEN: `/token/jwt/blacklist/`,
};

/**
 * User
 */
export const USER_ENDPOINTS = {
  LOGIN: `/user/login/`,
  LOGOUT: `/user/logout/`,
  REGISTRATION: `/user/registration/`,
  GET_BY_SLUG: (slug) => `/user/${slug}/`,
};

/**
 * User Self
 */
export const USER_SELF_ENDPOINTS = {
  GET_PROFILE: `/user-self/`,
  UPDATE_PROFILE: `/user-self/`,
  CHANGE_AVATAR: `/user-self/avatar/`,
  CHANGE_PASSWORD: `/user-self/change-password/`,
};

/**
 * Company
 */
export const COMPANY_ENDPOINTS = {
  CREATE: `/companies/`,
  GET_BY_SLUG: (slug) => `/companies/${slug}/`,
  DELETE: (slug) => `/companies/${slug}/delete/`,
  UPDATE_LOGO: (slug) => `/companies/${slug}/logo/`,
  UPDATE: (slug) => `/companies/${slug}/update/`,
  MY_COMPANIES: `/companies/my/`,
};

/**
 * Ads
 */
export const AD_ENDPOINTS = {
  CREATE: `/ads/`,
};

/**
 * Categories
 */
export const CATEGORY_ENDPOINTS = {
  LIST: `/categories/`,
  DETAIL: (slug) => `/categories/${slug}/`,
};

/**
 * Actors
 */
export const ACTOR_ENDPOINTS = {
  LIST: `/actors/`,
  GET_ACTIVE: `/actors/active/`,
  SET_ACTIVE: `/actors/set-active/`,
};

/**
 * Utilities
 * Теперь работает и с relative URL
 */
export const API_UTILS = {
  buildUrl: (path, params = {}) => {
    const qs = new URLSearchParams();
    Object.keys(params).forEach((key) => {
      const v = params[key];
      if (v !== undefined && v !== null) qs.append(key, String(v));
    });
    const query = qs.toString();
    return query ? `${path}?${query}` : path;
  },
  paginate: (url, page = 1, pageSize = 20) => {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}page=${page}&page_size=${pageSize}`;
  },
  sort: (url, sortBy, sortOrder = 'asc') => {
    const sep = url.includes('?') ? '&' : '?';
    return `${url}${sep}ordering=${sortOrder === 'desc' ? '-' : ''}${sortBy}`;
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

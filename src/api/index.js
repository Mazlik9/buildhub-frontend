// src/api/index.js
// ==================== Единая точка входа для API ====================

// Axios instance
export { default as api } from './axiosInstance';

// Endpoints
export { default as endpoints } from './endpoints';
export * from './endpoints';

// Services
export { default as apiServices } from './services';
export * from './services';

// ==================== Удобные алиасы для часто используемых сервисов ====================
export const authService = apiServices.auth;
export const userSelfService = apiServices.userSelf;
export const companyService = apiServices.companies;
export const adService = apiServices.ads;
export const categoryService = apiServices.categories;
export const actorService = apiServices.actors;

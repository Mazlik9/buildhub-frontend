// src/api/index.js
/**
 * Единая точка входа для импорта API
 */

// Экспорт axios instance
export { default as api } from './axiosInstance';
export * from './axiosInstance'; // setAuthTokens, clearAuthTokens, etc

// Экспорт endpoints
export { default as endpoints } from './endpoints';

// Экспорт всех сервисов
export { default as services } from './services';
export * from './services'; // Именованный экспорт всех сервисов

// Удобные алиасы для часто используемых сервисов
export { authService, userSelfService } from './services';
export { companyService } from './services';
export { adService } from './services';
export { categoryService } from './services';
export { actorService } from './services';

// Экспорт функций из authApi.js для обратной совместимости
export { registerUser, loginUser, logoutUser } from './services';
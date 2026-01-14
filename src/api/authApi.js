// src/api/authApi.js
import api from './axiosInstance';

// Регистрация пользователя
export const registerUser = async ({ email, full_name, password, password2 }) => {
  const response = await api.post('/user/registration/', {
    email,
    full_name,
    password,
    password2,
  });
  return response.data; // { email, full_name, access, refresh }
};

// Авторизация (логин)
export const loginUser = async ({ login, password }) => {
  const response = await api.post('/user/login/', {
    login,
    password,
  });
  return response.data; // { email, phone, full_name, access, refresh }
};

// Обновление access-токена через refresh-токен
export const refreshToken = async () => {
  const refresh = localStorage.getItem('refreshToken');
  if (!refresh) {
    throw new Error('Нет refresh-токена');
  }

  try {
    const response = await api.post('/user/token/refresh/', { refresh });
    return response.data; // { access, refresh? }
  } catch (error) {
    throw error;
  }
};

// Опционально: выход (если у вас есть такой эндпоинт)
export const logoutUser = async () => {
  try {
    await api.post('/user/logout/'); // если бэкенд требует запрос на выход
  } catch (error) {
    console.warn('Ошибка при выходе', error);
  } finally {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
};
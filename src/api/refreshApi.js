// src/api/refreshApi.js
import axios from 'axios';
import { AUTH_ENDPOINTS } from './endpoints';
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from '@/shared/lib/authTokens';

const API_BASE =
  `${import.meta.env.VITE_API_BASE_URL}${import.meta.env.VITE_API_VERSION}`;

const refreshClient = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
});

export const refreshAccessToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) {
    clearAuthTokens();
    throw new Error('No refresh token');
  }

  try {
    const res = await refreshClient.post(
      AUTH_ENDPOINTS.REFRESH_TOKEN,
      { refresh }
    );

    const newAccess = res?.data?.access;
    if (!newAccess) {
      clearAuthTokens();
      throw new Error('Refresh response has no access token');
    }

    // refresh-токен обычно тот же, но если бэк начнёт ротировать — можно расширить
    setAuthTokens(newAccess, refresh);
    return newAccess;
  } catch (err) {
    clearAuthTokens(); // единственная точка "жёсткого" logout по refresh-fail
    throw err;
  }
};

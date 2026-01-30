// src/api/refreshApi.js
import axios from 'axios';
import { AUTH_ENDPOINTS } from './endpoints';
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from '@/shared/lib/authTokens';

// ✅ ВАЖНО: refresh endpoint у тебя в корне, БЕЗ /api/v1
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // http://localhost:8000
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
      AUTH_ENDPOINTS.REFRESH_TOKEN, // должно быть "/token/jwt/refresh/"
      { refresh }
    );

    const newAccess = res?.data?.access;
    if (!newAccess) {
      clearAuthTokens();
      throw new Error('Refresh response has no access token');
    }

    setAuthTokens(newAccess, refresh);
    return newAccess;
  } catch (err) {
    clearAuthTokens();
    throw err;
  }
};

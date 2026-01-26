// src/api/refreshApi.js
import axios from 'axios';
import { AUTH_ENDPOINTS } from './endpoints';
import {
  getRefreshToken,
  setAuthTokens,
  clearAuthTokens,
} from '@/shared/lib/authTokens';

const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
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

    setAuthTokens(res.data.access, refresh);
    return res.data.access;
  } catch (err) {
    clearAuthTokens(); // 🔥 ЕДИНСТВЕННОЕ место logout
    throw err;
  }
};

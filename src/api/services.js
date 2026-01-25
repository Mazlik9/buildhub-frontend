// src/api/services.js
import api from './axiosInstance';
import {
  setAuthTokens,
  getAccessToken,
  getRefreshToken,
  clearAuthTokens,
} from '@/shared/lib/authTokens';
import {
  AUTH_ENDPOINTS,
  USER_ENDPOINTS,
  USER_SELF_ENDPOINTS,
  COMPANY_ENDPOINTS,
  AD_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  ACTOR_ENDPOINTS,
} from './endpoints';

// ================= Auth =================

export const login = async ({ login, password }) => {
  const res = await api.post(
    USER_ENDPOINTS.LOGIN,
    { login, password },
    { skipAuth: true }
  );
  if (res.data.access && res.data.refresh) {
    setAuthTokens(res.data.access, res.data.refresh);
  }
  return res.data;
};

export const register = async (data) => {
  const res = await api.post(
    USER_ENDPOINTS.REGISTRATION,
    data,
    { skipAuth: true }
  );
  if (res.data.access && res.data.refresh) {
    setAuthTokens(res.data.access, res.data.refresh);
  }
  return res.data;
};

export const refreshToken = async () => {
  const refresh = getRefreshToken();
  if (!refresh) throw new Error('Нет refresh-токена');

  const res = await api.post(
    AUTH_ENDPOINTS.REFRESH_TOKEN,
    { refresh },
    { skipAuth: true }
  );

  setAuthTokens(res.data.access, refresh);
  return res.data.access;
};

export const logout = async () => {
  const refresh = getRefreshToken();
  try {
    if (refresh) {
      await api.post(
        AUTH_ENDPOINTS.BLACKLIST_TOKEN,
        { refresh },
        { skipAuth: true }
      );
    }
  } catch (e) {
    console.warn('Ошибка logout', e);
  } finally {
    clearAuthTokens();
  }
};

// ================= User Self =================
export const getProfile = async () => {
  const res = await api.get(USER_SELF_ENDPOINTS.GET_PROFILE);
  return res.data;
};
export const updateProfile = async data => {
  const res = await api.patch(USER_SELF_ENDPOINTS.UPDATE_PROFILE, data);
  return res.data;
};
export const changeAvatar = async formData => {
  const res = await api.patch(USER_SELF_ENDPOINTS.CHANGE_AVATAR, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
export const changePassword = async data => {
  const res = await api.post(USER_SELF_ENDPOINTS.CHANGE_PASSWORD, data);
  return res.data;
};
export const getUserBySlug = async slug => {
  const res = await api.get(USER_ENDPOINTS.GET_BY_SLUG(slug));
  return res.data;
};

// ================= Company =================
export const createCompany = async data => (await api.post(COMPANY_ENDPOINTS.CREATE, data)).data;
export const getCompanyBySlug = async slug => (await api.get(COMPANY_ENDPOINTS.GET_BY_SLUG(slug))).data;
export const updateCompany = async (slug, data) => (await api.patch(COMPANY_ENDPOINTS.UPDATE(slug), data)).data;
export const deleteCompany = async slug => await api.delete(COMPANY_ENDPOINTS.DELETE(slug));
export const updateCompanyLogo = async (slug, formData) => {
  const res = await api.patch(COMPANY_ENDPOINTS.UPDATE_LOGO(slug), formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};
export const getMyCompanies = async () => (await api.get(COMPANY_ENDPOINTS.MY_COMPANIES)).data;

// ================= Ads =================
export const createAd = async data => (await api.post(AD_ENDPOINTS.CREATE, data)).data;

// ================= Categories =================
export const getAllCategories = async params => (await api.get(CATEGORY_ENDPOINTS.LIST, { params })).data;
export const getCategoryBySlug = async slug => (await api.get(CATEGORY_ENDPOINTS.DETAIL(slug))).data;

// ================= Actors =================
export const getAllActors = async () => (await api.get(ACTOR_ENDPOINTS.LIST)).data;
export const getActiveActor = async () => (await api.get(ACTOR_ENDPOINTS.GET_ACTIVE)).data;
export const setActiveActor = async actorId => (await api.post(ACTOR_ENDPOINTS.SET_ACTIVE, { actor_id: actorId })).data;

// ================= Export для совместимости =================
export const apiServices = {
  auth: { login, register, logout, refreshToken },
  userSelf: { getProfile, updateProfile, changeAvatar, changePassword, getUserBySlug },
  companies: { createCompany, getCompanyBySlug, updateCompany, deleteCompany, updateCompanyLogo, getMyCompanies },
  ads: { createAd },
  categories: { getAllCategories, getCategoryBySlug },
  actors: { getAllActors, getActiveActor, setActiveActor },
};

export default apiServices;

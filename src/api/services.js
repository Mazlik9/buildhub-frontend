// src/api/services.js
import api from './axiosInstance';
import {
  USER_ENDPOINTS,
  USER_SELF_ENDPOINTS,
  COMPANY_ENDPOINTS,
  AD_ENDPOINTS,
  CATEGORY_ENDPOINTS,
  ACTOR_ENDPOINTS,
} from './endpoints';

/* =====================================================
   AUTH (ТОЛЬКО HTTP, без токенов)
===================================================== */

export const login = async (credentials) => {
  const { data } = await api.post(
    USER_ENDPOINTS.LOGIN,
    credentials,
    { skipAuth: true }
  );
  return data;
};

export const register = async (payload) => {
  const { data } = await api.post(
    USER_ENDPOINTS.REGISTRATION,
    payload,
    { skipAuth: true }
  );
  return data;
};

export const logout = async () => {
  // backend может игнорировать, но интерфейс чистый
  await api.post(
    USER_ENDPOINTS.LOGOUT,
    {},
    { skipAuth: true }
  );
};

/* =====================================================
   USER SELF
===================================================== */

export const getProfile = async () => {
  const { data } = await api.get(USER_SELF_ENDPOINTS.GET_PROFILE);
  return data;
};

export const updateProfile = async (payload) => {
  const { data } = await api.patch(
    USER_SELF_ENDPOINTS.UPDATE_PROFILE,
    payload
  );
  return data;
};

export const changeAvatar = async (formData) => {
  const { data } = await api.patch(
    USER_SELF_ENDPOINTS.CHANGE_AVATAR,
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.post(
    USER_SELF_ENDPOINTS.CHANGE_PASSWORD,
    payload
  );
  return data;
};

export const getUserBySlug = async (slug) => {
  const { data } = await api.get(
    USER_ENDPOINTS.GET_BY_SLUG(slug)
  );
  return data;
};

/* =====================================================
   COMPANIES
===================================================== */

export const createCompany = async (payload) => {
  const { data } = await api.post(
    COMPANY_ENDPOINTS.CREATE,
    payload
  );
  return data;
};

export const getMyCompanies = async () => {
  const { data } = await api.get(
    COMPANY_ENDPOINTS.MY_COMPANIES
  );
  return data;
};

export const getCompanyBySlug = async (slug) => {
  const { data } = await api.get(
    COMPANY_ENDPOINTS.GET_BY_SLUG(slug)
  );
  return data;
};

export const updateCompany = async (slug, payload) => {
  const { data } = await api.patch(
    COMPANY_ENDPOINTS.UPDATE(slug),
    payload
  );
  return data;
};

export const updateCompanyLogo = async (slug, formData) => {
  const { data } = await api.patch(
    COMPANY_ENDPOINTS.UPDATE_LOGO(slug),
    formData,
    { headers: { 'Content-Type': 'multipart/form-data' } }
  );
  return data;
};

export const deleteCompany = async (slug) => {
  await api.delete(
    COMPANY_ENDPOINTS.DELETE(slug)
  );
};

/* =====================================================
   ADS
===================================================== */

export const createAd = async (payload) => {
  const { data } = await api.post(
    AD_ENDPOINTS.CREATE,
    payload
  );
  return data;
};

/* =====================================================
   CATEGORIES
===================================================== */

export const getAllCategories = async (params) => {
  const { data } = await api.get(
    CATEGORY_ENDPOINTS.LIST,
    { params }
  );
  return data;
};

export const getCategoryBySlug = async (slug) => {
  const { data } = await api.get(
    CATEGORY_ENDPOINTS.DETAIL(slug)
  );
  return data;
};

/* =====================================================
   ACTORS
===================================================== */

export const getAllActors = async () => {
  const { data } = await api.get(
    ACTOR_ENDPOINTS.LIST
  );
  return data;
};

export const getActiveActor = async () => {
  const { data } = await api.get(
    ACTOR_ENDPOINTS.GET_ACTIVE
  );
  return data;
};

export const setActiveActor = async (actorId) => {
  const { data } = await api.post(
    ACTOR_ENDPOINTS.SET_ACTIVE,
    { actor_id: actorId }
  );
  return data;
};

// src/utils/api.js
const API_BASE = "http://localhost:8000"; // или твой адрес бэкенда

async function refreshAccessToken() {
  const refreshToken = localStorage.getItem("refresh_token");
  if (!refreshToken) {
    throw new Error("Нет refresh-токена");
  }

  const response = await fetch(`${API_BASE}/token/jwt/refresh/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh: refreshToken }),
  });

  if (!response.ok) {
    // Refresh-токен недействителен — очищаем и редиректим на логин
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");
    throw new Error("Refresh-токен недействителен");
  }

  const data = await response.json();
  localStorage.setItem("access_token", data.access);
  return data.access;
}

export async function apiFetch(url, options = {}) {
  let token = localStorage.getItem("access_token");

  const headers = {
    ...options.headers,
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Для FormData НЕ ставим Content-Type (браузер сам добавит boundary)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }

  const config = {
    ...options,
    headers,
  };

  let response = await fetch(`${API_BASE}${url}`, config);

  // Если получили 401 — пробуем обновить токен и повторить запрос
  if (response.status === 401 && token) {
    try {
      const newToken = await refreshAccessToken();
      // Обновляем заголовок и повторяем запрос
      config.headers["Authorization"] = `Bearer ${newToken}`;
      response = await fetch(`${API_BASE}${url}`, config);
    } catch (err) {
      console.error("Не удалось обновить токен:", err);
      // При ошибке обновления — очищаем и редиректим на главную/логин
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");
      window.location.href = "/"; // или "/login"
      return response; // возвращаем оригинальный ответ, чтобы не падало дальше
    }
  }

  return response;
}
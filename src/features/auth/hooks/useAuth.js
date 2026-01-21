// src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { authService, setAuthTokens } from '@/api';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async ({ login, password }) => {
    setIsLoading(true);
    try {
      const response = await authService.login({ login, password });

      if (response.access && response.refresh) {
        setAuthTokens(response.access, response.refresh);
      }

      setUser({
        email: response.email,
        full_name: response.full_name,
        avatar: response.avatar || null,
      });

      toast.success(`Добро пожаловать, ${response.full_name || 'пользователь'}!`);
      return response;
    } catch (error) {
      let errorMessage = 'Ошибка входа. Проверьте логин и пароль.';
      if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async ({ full_name, email, password, password2 }) => {
    setIsLoading(true);
    try {
      const response = await authService.register({ full_name, email, password, password2 });

      if (response.access && response.refresh) {
        setAuthTokens(response.access, response.refresh);
      }

      setUser({
        email: response.email,
        full_name: response.full_name,
      });

      toast.success(`Регистрация успешна! Добро пожаловать, ${response.full_name || 'пользователь'}!`);
      return response;
    } catch (error) {
      let errorMessage = 'Ошибка регистрации.';
      if (error.response?.data?.detail) errorMessage = error.response.data.detail;
      toast.error(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setAuthTokens(null, null);
    toast.info('Вы вышли из аккаунта');
  }, []);

  return { user, isLoading, login, register, logout };
};

// src/features/auth/hooks/useAuth.js
import { useState, useCallback } from 'react';
import { apiServices } from '@/api/services';
import { clearAuthTokens, setAuthTokens } from '@/shared/lib/authTokens';
import { toast } from 'sonner';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const res = await apiServices.auth.login(data);
      setAuthTokens(res.access, res.refresh);

      setUser({
        email: res.email,
        full_name: res.full_name,
        avatar: res.avatar || null,
      });

      toast.success('Добро пожаловать!');
      return res;
    } catch (e) {
      toast.error('Ошибка входа');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (data) => {
    setIsLoading(true);
    try {
      const res = await apiServices.auth.register(data);
      setAuthTokens(res.access, res.refresh);

      setUser({
        email: res.email,
        full_name: res.full_name,
        avatar: null,
      });

      toast.success('Регистрация успешна!');
      return res;
    } catch (e) {
      toast.error('Ошибка регистрации');
      throw e;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiServices.auth.logout();
    } catch {
      // игнор
    } finally {
      clearAuthTokens();
      setUser(null);
      toast.info('Вы вышли');
    }
  }, []);

  return {
    user,
    isLoggedIn: !!user,
    isLoading,
    login,
    register,
    logout,
  };
};

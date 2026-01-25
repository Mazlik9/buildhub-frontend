// src/features/auth/AuthProvider.jsx
import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { apiServices } from '@/api/services';
import { getAccessToken, getRefreshToken, setAuthTokens, clearAuthTokens } from '@/shared/lib/authTokens';
import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // ===== Восстановление сессии =====
  const restoreSession = useCallback(async () => {
    const access = getAccessToken();
    if (!access) {
      setIsInitialized(true);
      return;
    }

    try {
      const profile = await apiServices.userSelf.getProfile();
      setUser(profile);
    } catch (e) {
      clearAuthTokens();
      setUser(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  // ===== Login =====
  const login = useCallback(async ({ login, password }) => {
    setIsLoading(true);
    try {
      const res = await apiServices.auth.login({ login, password });

      setAuthTokens(res.access, res.refresh);

      setUser({
        email: res.email,
        full_name: res.full_name,
        avatar: res.avatar || null,
      });

      toast.success(`Добро пожаловать, ${res.full_name || 'пользователь'}!`);
      return res;
    } catch (error) {
      toast.error('Ошибка входа. Проверьте данные.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== Register =====
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
    } catch (error) {
      toast.error('Ошибка регистрации.');
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ===== Logout =====
  const logout = useCallback(async () => {
    try {
      await apiServices.auth.logout();
    } catch (e) {
      console.warn('Ошибка logout', e);
    } finally {
      clearAuthTokens();
      setUser(null);
      toast.info('Вы вышли из аккаунта');
    }
  }, []);

  const getInitials = useCallback((full_name = '') => {
    return full_name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading,
        isInitialized,
        login,
        register,
        logout,
        getInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// ===== Хук для использования контекста =====
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuthContext должен использоваться внутри <AuthProvider>');
  return context;
};

// src/features/auth/AuthProvider.jsx
import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react';

import {
  login as loginRequest,
  register as registerRequest,
  logout as logoutRequest,
  getProfile,
} from '@/api/services';

import { toast } from 'sonner';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  /* ================= Restore session ================= */

  const restoreSession = useCallback(async () => {
    try {
      const profile = await getProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  /* ================= Login ================= */

  const login = useCallback(async (credentials) => {
    setIsLoading(true);
    try {
      const data = await loginRequest(credentials);
      // Токены уже сохраняются внутри API

      const profile = await getProfile();
      setUser(profile);

      toast.success(`Добро пожаловать, ${profile.full_name || 'пользователь'}!`);
      return data;
    } catch (err) {
      toast.error('Ошибка входа. Проверьте данные.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ================= Register ================= */

  const register = useCallback(async (payload) => {
    setIsLoading(true);
    try {
      const data = await registerRequest(payload);

      const profile = await getProfile();
      setUser(profile);

      toast.success('Регистрация успешна!');
      return data;
    } catch (err) {
      toast.error('Ошибка регистрации.');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  /* ================= Logout ================= */

  const logout = useCallback(async () => {
    try {
      await logoutRequest();
    } catch {
      // backend может упасть — нам всё равно
    } finally {
      setUser(null);
      toast.info('Вы вышли из аккаунта');
    }
  }, []);

  /* ================= Update user ================= */

  const updateUser = useCallback((updatedDataOrFn) => {
    setUser((prev) => {
      if (typeof updatedDataOrFn === 'function') {
        return updatedDataOrFn(prev);
      }
      return { ...prev, ...updatedDataOrFn };
    });
  }, []);

  /* ================= Utils ================= */

  const getInitials = useCallback((fullName = '') => {
    return fullName
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: Boolean(user),
        isLoading,
        isInitialized,
        login,
        register,
        logout,
        updateUser,
        getInitials,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
    
/* ================= Hook ================= */

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return ctx;
};

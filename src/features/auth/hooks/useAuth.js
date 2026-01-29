// src/features/auth/hooks/useAuth.js
import { useAuthContext } from '../AuthProvider';

export const useAuth = () => {
  const { user, isLoggedIn, login, register, logout, isLoading, isInitialized } = useAuthContext();

  return {
    user,
    isLoggedIn,
    isLoading,
    isInitialized,
    login,
    register,
    logout,
  };
};
  
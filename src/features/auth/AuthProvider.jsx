// src/features/auth/AuthProvider.jsx
import { createContext, useContext } from 'react';
import { useAuth } from './hooks/useAuth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const auth = useAuth(); // { user, isLoading, login, register, logout }

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

// Хук для удобного использования контекста
export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext должен использоваться внутри <AuthProvider>');
  }
  return context;
};

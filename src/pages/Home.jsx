// src/pages/Home.jsx
import { useState, useEffect } from 'react';
import Header from '../components/layout/header/Header.jsx';
import AuthModal from '../components/ui/AuthModal';
import RegisterModal from '../components/ui/RegisterModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userData, setUserData] = useState(null);

  // Проверяем авторизацию при загрузке компонента
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUserData = localStorage.getItem('userData');
    if (token && savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleSuccessfulLogin = (userData) => {
    setIsLoggedIn(true);
    setUserData(userData);
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserData(null);
  };

  // Функция для получения инициалов из имени пользователя
  const getInitials = (fullName) => {
    if (!fullName) return 'U';
    
    const nameParts = fullName.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col">
      {/* Используем новый хедер с передачей состояния авторизации и данных пользователя */}
      <Header 
        setIsAuthModalOpen={setIsAuthModalOpen}
        isLoggedIn={isLoggedIn}
        onLogout={handleLogout}
        userData={userData}
        getInitials={getInitials}
      />

      {/* Главный контент - только заголовок */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-800">
            Добро пожаловать в <span className="text-[#ef6c1a]">BUILDHUB</span>
          </h1>
        </div>
      </main>

      {/* Модальные окна */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSuccessfulLogin={handleSuccessfulLogin}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
// src/components/layout/header/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { RegisterModal } from '@/features/auth/components/RegisterModal';

export default function Header() {
  const { isLoggedIn, userData, logout, getInitials } = useAuthContext();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    console.log('Поиск выполнен');
  };

  const handleLoginClick = () => setIsAuthModalOpen(true);
  const handleProfileClick = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const handleNavigateToProfile = () => {
    navigate('/profile');
    setIsProfileDropdownOpen(false);
  };

  const handleSuccessfulAuth = (user) => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(false);
    console.log('Авторизация успешна:', user);
  };

  const DesktopAvatar = () => {
    if (userData?.avatar) {
      return <img src={userData.avatar} alt="Аватар" className="w-12 h-12 rounded-full object-cover border-2 border-white" />;
    }
    const initials = userData?.full_name ? getInitials(userData.full_name) : 'U';
    return (
      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg">
        {initials}
      </div>
    );
  };

  const MobileAvatar = () => {
    if (userData?.avatar) {
      return <img src={userData.avatar} alt="Аватар" className="w-10 h-10 rounded-full object-cover border-2 border-white" />;
    }
    const initials = userData?.full_name ? getInitials(userData.full_name) : 'U';
    return (
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
        {initials}
      </div>
    );
  };

  return (
    <header className="w-full bg-[#ef6c1a] rounded-bl-[20px] rounded-br-[20px] shadow-lg">
      {/* Мобильная версия */}
      <div className="lg:hidden flex items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-[9px] bg-white/30 flex items-center justify-center">
            <span className="text-2xl">🏗️</span>
          </div>
          <p className="text-xl font-bold text-white tracking-tight">BUILDHUB</p>
        </Link>

        {isLoggedIn ? (
          <div className="flex items-center gap-2">
            <button onClick={handleProfileClick} className="w-10 h-10 rounded-full bg-[#C9C8C8] flex items-center justify-center">
              <MobileAvatar />
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute top-12 right-0 z-50 w-48 bg-white rounded-lg shadow-lg py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{userData?.full_name || 'Пользователь'}</p>
                  <p className="text-sm text-gray-500">{userData?.email || userData?.phone || ''}</p>
                </div>
                <button onClick={handleNavigateToProfile} className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-800">
                  Мой профиль
                </button>
                <button onClick={logout} className="w-full px-4 py-3 text-left hover:bg-gray-100 text-red-600 border-t border-gray-200">
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLoginClick} className="w-12 h-12 rounded-full bg-[#2c3f4d] flex items-center justify-center text-white font-bold">
            Войти
          </button>
        )}
      </div>

      {/* Десктопная версия */}
      <div className="hidden lg:flex items-center justify-between px-[248px] h-[75px]">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-12 h-12 rounded-[9px] bg-white/30 flex items-center justify-center">
            <span className="text-3xl">🏗️</span>
          </div>
          <p className="text-2xl font-bold text-white tracking-tight">BUILDHUB</p>
        </Link>

        <form onSubmit={handleSearch} className="flex-1 mx-8">
          <div className="flex items-center w-full h-12 rounded-[20px] bg-white px-4">
            <input
              type="text"
              placeholder="Поиск по сайту"
              className="w-full text-base font-light text-[#878787] focus:outline-none placeholder:text-[#878787]"
            />
            <button type="submit" className="ml-2">🔍</button>
          </div>
        </form>

        {isLoggedIn ? (
          <div className="flex items-center gap-6 relative">
            <button onClick={handleProfileClick} className="flex items-center gap-2">
              <DesktopAvatar />
              <span className="text-white font-medium">Профиль</span>
            </button>
            {isProfileDropdownOpen && (
              <div className="absolute top-full right-0 z-50 w-48 bg-white rounded-lg shadow-lg py-2">
                <div className="px-4 py-3 border-b border-gray-200">
                  <p className="font-medium text-gray-800">{userData?.full_name || 'Пользователь'}</p>
                  <p className="text-sm text-gray-500">{userData?.email || userData?.phone || ''}</p>
                </div>
                <button onClick={handleNavigateToProfile} className="w-full px-4 py-3 text-left hover:bg-gray-100 text-gray-800">
                  Мой профиль
                </button>
                <button onClick={logout} className="w-full px-4 py-3 text-left hover:bg-gray-100 text-red-600 border-t border-gray-200">
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={handleLoginClick} className="w-52 h-12 rounded-[20px] bg-[#2c3f4d] text-white font-bold">
            Войти
          </button>
        )}
      </div>

      {/* Модалки авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
        onSuccessfulLogin={handleSuccessfulAuth}
      />
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        onSuccessfulRegistration={handleSuccessfulAuth}
      />
    </header>
  );
}

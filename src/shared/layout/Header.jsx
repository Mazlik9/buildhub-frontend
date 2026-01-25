// src/shared/layout/Header.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { AuthModal } from '@/features/auth/components/AuthModal';
import { RegisterModal } from '@/features/auth/components/RegisterModal';

export default function Header() {
  const { user, logout } = useAuthContext();
  const isLoggedIn = !!user;

  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    console.log('Header видит auth-state:', { isLoggedIn, user });
  }, [isLoggedIn, user]);

  const openLogin = () => setIsAuthModalOpen(true);

  const toggleProfile = () =>
    setIsProfileDropdownOpen((prev) => !prev);

  const goToProfile = () => {
    navigate('/profile');
    setIsProfileDropdownOpen(false);
  };

  const handleSuccessfulAuth = () => {
    setIsAuthModalOpen(false);
    setIsRegisterModalOpen(false);
  };

  // ===== utils (позже можно вынести в shared/utils)
  const getInitials = (fullName = '') => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  // ===== Avatar
  const ProfileAvatar = () => {
    if (user?.avatar) {
      return (
        <img
          src={user.avatar}
          alt="Аватар"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    const initials = user?.full_name
      ? getInitials(user.full_name)
      : 'U';

    return (
      <div className="w-12 h-12 rounded-full bg-[#C9C8C8] flex items-center justify-center text-white font-bold text-xl">
        {initials}
      </div>
    );
  };

  return (
    <>
      <header className="flex justify-center items-center w-full h-[75px] gap-[120px] bg-[#ef6c1a]">
        {/* LEFT */}
        <div className="flex justify-start items-center gap-10">
          <Link to="/" className="flex justify-center items-center gap-2.5">
            <div className="w-[52px] h-[50px] rounded-[9px] bg-[#d9d9d9]" />
            <p className="text-xl font-bold text-white">BUILDHUB</p>
          </Link>

          <button className="flex justify-center items-center overflow-hidden gap-2.5 px-[18px] py-[15px] rounded-[20px] bg-[#2c3f4d]">
            <p className="text-xl font-bold text-white">Каталог</p>
          </button>
        </div>

        {/* SEARCH */}
        <div className="flex justify-between items-center w-[700px] px-5 py-3.5 rounded-[20px] bg-white">
          <input
            type="text"
            placeholder="Поиск по сайту"
            className="flex-1 bg-transparent outline-none text-xl font-light text-[#878787]"
          />
        </div>

        {/* RIGHT */}
        {isLoggedIn ? (
          <div className="flex items-center relative gap-[23px]">
            {/* PROFILE */}
            <div className="relative">
              <button
                onClick={toggleProfile}
                className="flex items-center w-[97px] h-[52px] gap-[13px] pl-0.5 pr-3 rounded-[30px] bg-[#2c3f4d]"
              >
                <ProfileAvatar />
                <span className="text-white">⌄</span>
              </button>

              {isProfileDropdownOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-2xl z-50 overflow-hidden">
                  <div className="px-5 py-4 border-b">
                    <p className="font-semibold">
                      {user?.full_name || 'Пользователь'}
                    </p>
                    <p className="text-sm text-gray-500">
                      {user?.email}
                    </p>
                  </div>

                  <button
                    onClick={goToProfile}
                    className="w-full px-5 py-3 text-left hover:bg-gray-50"
                  >
                    Мой профиль
                  </button>

                  <button
                    onClick={() => {
                      logout();
                      setIsProfileDropdownOpen(false);
                    }}
                    className="w-full px-5 py-3 text-left text-red-600 hover:bg-gray-50 border-t"
                  >
                    Выйти
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="w-[244px] h-[52px] rounded-[20px] bg-[#2c3f4d] text-white font-bold"
          >
            Войти
          </button>
        )}
      </header>

      {/* MODALS */}
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
    </>
  );
}

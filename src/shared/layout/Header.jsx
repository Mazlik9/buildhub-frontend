// src/shared/layout/Header.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { AuthFormModal } from '@/features/auth/components/AuthFormModal';

export default function Header() {
  const {
    user,
    isLoggedIn,
    isInitialized,
    logout,
    getInitials,
  } = useAuthContext();

  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [profileOpen, setProfileOpen] = useState(false);

  /* ================= Handlers ================= */

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    navigate('/');
  };

  const goProfile = () => {
    navigate('/profile');
    setProfileOpen(false);
  };

  /* ================= UI ================= */

  const Avatar = () => {
    if (user?.avatar) {
      // Фикс для аватара: нормализуем путь и добавляем полный URL к media-серверу
      const normalizedAvatar = user.avatar.replace(/^\/+/, '/'); // Убирает лишние слеши, фиксит "//buildhub-local-media"
      const mediaBaseUrl = import.meta.env.VITE_MEDIA_URL; // Бери из .env или fallback на dev
      return (
        <img
          src={`${mediaBaseUrl}${normalizedAvatar}`}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
          onError={(e) => {
            // Fallback на initials при ошибке загрузки (например, если media недоступен)
            e.target.onerror = null;
            e.target.style.display = 'none'; // Скрываем img, чтобы initials отобразились
          }}
        />
      );
    }

    return (
      <div className="w-10 h-10 rounded-full bg-[#c9c8c8] flex items-center justify-center text-white font-bold">
        {getInitials(user?.full_name || 'U')}
      </div>
    );
  };

  return (
    <>
      <header className="w-full h-[75px] bg-[#ef6c1a] flex items-center justify-between px-8">
        {/* ===== LOGO ===== */}
        <Link to="/" className="flex items-center gap-3">
          <div className="w-[50px] h-[50px] rounded-lg bg-white/80" />
          <span className="text-white text-xl font-black">BUILDHUB</span>
        </Link>

        {/* ===== SEARCH ===== */}
        <div className="flex-1 mx-10 max-w-[700px] bg-white rounded-2xl px-5 py-3">
          <input
            placeholder="Поиск по сайту"
            className="w-full outline-none text-gray-700"
          />
        </div>

        {/* ===== RIGHT ===== */}
        {!isInitialized ? null : isLoggedIn ? (
          <div className="relative">
            <button
              onClick={() => setProfileOpen(prev => !prev)}
              className="flex items-center gap-3 bg-[#2c3f4d] px-3 py-2 rounded-full"
            >
              <Avatar />
              <span className="text-white">⌄</span>
            </button>

            {profileOpen && (
              <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                <div className="px-4 py-3 border-b">
                  <p className="font-semibold">
                    {user?.full_name || 'Пользователь'}
                  </p>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                </div>

                <button
                  onClick={goProfile}
                  className="w-full text-left px-4 py-3 hover:bg-gray-100"
                >
                  Мой профиль
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 border-t"
                >
                  Выйти
                </button>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={openLogin}
            className="bg-[#2c3f4d] text-white px-8 py-3 rounded-2xl font-bold"
          >
            Войти
          </button>
        )}
      </header>

      {/* ===== AUTH MODAL ===== */}
      <AuthFormModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={() =>
          setAuthMode(prev => (prev === 'login' ? 'register' : 'login'))
        }
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
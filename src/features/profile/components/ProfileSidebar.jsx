// src/features/profile/components/ProfileSideBar.jsx
import { useRef } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthContext } from '@/features/auth/AuthProvider';

export default function ProfileSideBar({ activeTab, onTabChange }) {
  const { profile, updateAvatar, loading } = useProfile();
  const { logout } = useAuthContext(); // берём logout из глобального контекста

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Пока идёт загрузка профиля — показываем скелетон или просто плейсхолдер
  if (loading || !profile) {
    return (
      <div className="w-full lg:w-80 bg-white rounded-2xl shadow p-6 flex flex-col gap-6 animate-pulse">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-gray-300" />
          <div className="mt-4 h-8 w-48 bg-gray-300 rounded" />
          <div className="mt-2 h-5 w-40 bg-gray-200 rounded" />
        </div>
        <div className="flex flex-col gap-2">
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
          <div className="h-12 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-white rounded-2xl shadow p-6 flex flex-col gap-6">
      {/* Аватар + имя + email */}
      <div className="flex flex-col items-center">
        <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
          {profile.avatar ? (
            <img
              src={profile.avatar}
              alt="Аватар"
              className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 transition-transform group-hover:scale-105"
            />
          ) : (
            <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-5xl font-bold shadow-inner">
              {profile.full_name?.[0]?.toUpperCase() || '?'}
            </div>
          )}

          {/* Иконка карандаша при наведении */}
          <div className="absolute bottom-1 right-1 bg-orange-600 text-white p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        <h2 className="mt-4 text-2xl font-bold text-gray-900">
          {profile.full_name || 'Пользователь'}
        </h2>
        <p className="text-gray-500 text-sm mt-1">{profile.email}</p>
      </div>

      {/* Навигация по табам */}
      <div className="flex flex-col gap-2">
        <button
          onClick={() => onTabChange('edit')}
          className={`w-full py-3 px-4 text-left rounded-xl transition font-medium ${
            activeTab === 'edit'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white shadow-md'
              : 'text-gray-700 hover:bg-orange-50'
          }`}
        >
          Редактировать профиль
        </button>

        <button
          onClick={() => onTabChange('ads')}
          className={`w-full py-3 px-4 text-left rounded-xl transition font-medium ${
            activeTab === 'ads'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white shadow-md'
              : 'text-gray-700 hover:bg-orange-50'
          }`}
        >
          Мои объявления
        </button>

        <button
          onClick={() => onTabChange('companies')}
          className={`w-full py-3 px-4 text-left rounded-xl transition font-medium ${
            activeTab === 'companies'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white shadow-md'
              : 'text-gray-700 hover:bg-orange-50'
          }`}
        >
          Мои компании
        </button>
      </div>

      {/* Кнопка выхода */}
      <button
        onClick={logout}
        className="mt-auto py-3 px-4 text-red-600 font-medium hover:bg-red-50 rounded-xl transition flex items-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          <polyline points="16 17 21 12 16 7" />
          <line x1="21" y1="12" x2="9" y2="12" />
        </svg>
        Выйти
      </button>
    </div>
  );
}
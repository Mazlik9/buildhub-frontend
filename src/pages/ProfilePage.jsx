// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileSideBar from '@/features/profile/components/ProfileSideBar';
import ProfileEditForm from '@/features/profile/components/ProfileEditForm/ProfileEditForm';
import ProfileAds from '@/features/profile/components/ProfileAds/ProfileAds';
import ProfileCompanies from '@/features/profile/components/ProfileCompanies/ProfileCompanies';

export default function ProfilePage() {
  const { isLoggedIn } = useAuthContext();
  const { profile, loading, error } = useProfile();

  // Текущая вкладка: 'edit' | 'ads' | 'companies'
  const [activeTab, setActiveTab] = useState('edit');

  // Если не залогинен — показываем сообщение или редиректим
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f4f6f5]">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Доступ ограничен</h2>
          <p className="text-gray-600 mb-6">
            Пожалуйста, войдите в аккаунт, чтобы посмотреть профиль
          </p>
          <button
            onClick={() => {/* здесь можно открыть модалку логина */}}
            className="px-8 py-4 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  // Пока грузится профиль
  if (loading) {
    return (
      <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-orange-400 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-xl text-gray-700">Загрузка профиля...</p>
        </div>
      </div>
    );
  }

  // Ошибка загрузки
  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#f4f6f5] flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Что-то пошло не так</h2>
          <p className="text-gray-600 mb-6">{error || 'Профиль не удалось загрузить'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f6f5] py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Боковая панель с навигацией */}
        <ProfileSideBar
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />

        {/* Основной контент — зависит от выбранной вкладки */}
        <div className="flex-1">
          {activeTab === 'edit' && <ProfileEditForm />}

          {activeTab === 'ads' && <ProfileAds />}

          {activeTab === 'companies' && <ProfileCompanies />}
        </div>
      </div>
    </div>
  );
}
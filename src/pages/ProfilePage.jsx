// src/pages/ProfilePage.jsx
import { useState } from 'react';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { useProfile } from '@/features/profile/hooks/useProfile';
import ProfileSideBar from '@/features/profile/components/ProfileSideBar';
import ProfileEditForm from '@/features/profile/components/ProfileEditForm/ProfileEditForm';
import ProfileAds from '@/features/profile/components/ProfileAds/ProfileAds';
import ProfileCompanies from '@/features/profile/components/ProfileCompanies/ProfileCompanies';
import { toast } from 'sonner';

export default function ProfilePage() {
  const { isLoggedIn, openLoginModal } = useAuthContext();
  const { profile, loading, error } = useProfile();
  const [activeTab, setActiveTab] = useState('edit');

  // Пользователь не залогинен
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Доступ ограничен</h2>
          <p className="text-gray-600 mb-6">
            Пожалуйста, войдите в аккаунт, чтобы посмотреть профиль
          </p>
          <button
            onClick={() => {
              if (typeof openLoginModal === 'function') {
                openLoginModal();
              } else {
                toast('Функция логина временно недоступна');
              }
            }}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition"
          >
            Войти
          </button>
        </div>
      </div>
    );
  }

  // Загрузка профиля
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
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
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center p-10 bg-white rounded-2xl shadow-xl max-w-md">
          <h2 className="text-3xl font-bold text-red-600 mb-4">Что-то пошло не так</h2>
          <p className="text-gray-600 mb-6">{error?.message || 'Профиль не удалось загрузить'}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-gradient-to-r from-orange-400 to-orange-600 text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition"
          >
            Попробовать снова
          </button>
        </div>
      </div>
    );
  }

  // Основной контент профиля
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">
        {/* Боковая панель */}
        <ProfileSideBar activeTab={activeTab} onTabChange={setActiveTab} />

        {/* Контент вкладок */}
        <div className="flex-1" key={activeTab}>
          {activeTab === 'edit' && <ProfileEditForm profile={profile} />}
          {activeTab === 'ads' && <ProfileAds />}
          {activeTab === 'companies' && <ProfileCompanies />}
        </div>
      </div>
    </div>
  );
}

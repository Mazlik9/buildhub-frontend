// src/pages/ProfilePage.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '@/features/profile/hooks/useProfile';

import ProfileSideBar from '@/features/profile/components/ProfileSideBar';
import ProfileInfoForm from '@/features/profile/components/ProfileInfoForm/ProfileInfoForm';
import ProfileAds from '@/features/profile/components/ProfileAds/ProfileAds';
import ProfileCompanies from '@/features/profile/components/ProfileCompanies/ProfileCompanies';

export default function ProfilePage() {
  const navigate = useNavigate();
  const { isLoggedIn, isInitialized, logout } = useAuth();

  const { profile, loading, error, fetchProfile, updateProfile } = useProfile();

  const tabs = useMemo(
    () => [
      { id: 'edit', label: 'Мой профиль' },
      { id: 'ads', label: 'Мои объявления' },
      { id: 'companies', label: 'Мои компании' },
      { id: 'reviews', label: 'Мои отзывы' }, // пока заглушка
    ],
    []
  );

  const [activeTab, setActiveTab] = useState('edit');

  /* ================= Access control ================= */
  useEffect(() => {
    if (!isInitialized) return;
    if (!isLoggedIn) navigate('/');
  }, [isInitialized, isLoggedIn, navigate]);

  /* ================= Load profile ================= */
  useEffect(() => {
    if (!isInitialized) return;
    if (isLoggedIn && !profile && !loading) fetchProfile();
  }, [isInitialized, isLoggedIn, profile, loading, fetchProfile]);

  if (!isInitialized) {
    return <div className="py-10 text-center text-gray-600">Загрузка...</div>;
  }

  if (!isLoggedIn) {
    return <div className="py-10 text-center text-gray-600">Нужно войти в аккаунт</div>;
  }

  return (
    <div className="w-full min-h-[calc(100vh-75px)] bg-[#fff4e5] flex justify-center">
      {/* 1920 как в фигме */}
      <div className="w-full max-w-[1920px] px-[149px] py-[40px]">
        {/* Ряд: sidebar + content */}
        <div className="flex gap-[26px]">
          {/* SIDEBAR */}
          <div className="w-[383px] h-[1000px] flex-shrink-0">
            <ProfileSideBar
              profile={profile}
              tabs={tabs}
              activeTab={activeTab}
              onChangeTab={setActiveTab}
              onLogout={logout}
            />
          </div>
    
          {/* CONTENT */}
          <div className="w-[1200px] h-[1000px] min-w-0">
            {loading && !profile ? (
              <div className="h-full flex items-center justify-center text-gray-600">
                Загружаем профиль...
              </div>
            ) : error ? (
              <div className="h-full p-6">
                <div className="p-4 rounded-xl bg-red-50 text-red-700">{error}</div>
                <button
                  onClick={fetchProfile}
                  className="mt-4 px-6 py-3 rounded-xl bg-[#2c3f4d] text-white font-bold"
                >
                  Повторить
                </button>
              </div>
            ) : (
              <>
                {activeTab === 'edit' && (
                  <ProfileInfoForm
                    profile={profile}
                    onSave={updateProfile}
                    isSaving={loading}
                  />
                )}
  
                {activeTab === 'ads' && <ProfileAds profile={profile} />}
              
                {activeTab === 'companies' && <ProfileCompanies profile={profile} />}
              
                {activeTab === 'reviews' && (
                  <div className="w-full h-full flex items-center justify-center text-gray-500">
                    Раздел “Мои отзывы” сделаем позже
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

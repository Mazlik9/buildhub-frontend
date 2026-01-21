import React, { useState, useEffect } from 'react';
import ProfileSideBar from "../features/profile/components/ProfileSidebar";
import ProfileEditForm from "../features/profile/components/ProfileEditForm";

const ProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [userData, setUserData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Получаем данные пользователя из localStorage
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const savedUserData = localStorage.getItem('userData');
    if (token && savedUserData) {
      setIsLoggedIn(true);
      setUserData(JSON.parse(savedUserData));
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleLogout = () => {
    // Удаляем токены из localStorage
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userData');
    // Редирект на главную страницу
    window.location.href = '/';
  };

  const handleSaveProfile = (formData) => {
    console.log('Сохранение данных профиля:', formData);
    // Здесь можно добавить логику сохранения данных профиля
  };

  const handleCancelProfile = () => {
    console.log('Отмена изменений профиля');
  };

  const handleChangePassword = () => {
    console.log('Смена пароля');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] overflow-x-hidden">
      {/* Основной контент - центрированный с отступами */}
      <div className="flex justify-center px-4 sm:px-8 md:px-12 lg:px-[150px] mt-8">
        <div className="flex flex-col lg:flex-row gap-8 w-full max-w-[1598px]">
          {/* Боковая панель профиля */}
          <ProfileSideBar
            onEditProfile={() => console.log('Редактировать профиль')}
            onMyAds={() => console.log('Мои объявления')}
            onMyCompanies={() => console.log('Мои компании')}
            onLogout={handleLogout}
          />
          
          {/* Форма редактирования профиля */}
          <ProfileEditForm
            initialData={{
              email: userData?.email || 'ivanov@example.com',
              fullName: userData?.full_name || 'Иванов Иван Иванович',
              phone: userData?.phone || '+7 (999) 123-45-67',
              birthDate: '1990-01-01',
              gender: 'male'
            }}
            onSave={handleSaveProfile}
            onCancel={handleCancelProfile}
            onChangePassword={handleChangePassword}
          />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
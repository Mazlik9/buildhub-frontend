import React, { useState } from 'react';
import Header from "./components/ProfileHeader";
import ProfileSideBar from "./components/ProfileSidebar";
import ProfileEditForm from "./components/ProfileEditForm";

const ProfilePage = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogoClick = () => {
    console.log('Нажатие на логотип');
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleEditProfile = () => {
    console.log('Редактировать профиль');
  };

  const handleMyAds = () => {
    console.log('Мои объявления');
  };

  const handleMyCompanies = () => {
    console.log('Мои компании');
  };

  const handleLogout = () => {
    console.log('Выход из аккаунта');
  };

  const handleSaveProfile = (formData) => {
    console.log('Сохранение данных профиля:', formData);
  };

  const handleCancelProfile = () => {
    console.log('Отмена изменений профиля');
  };

  const handleChangePassword = () => {
    console.log('Смена пароля');
  };

  return (
    <div className="min-h-screen bg-[#f4f6f5] overflow-x-hidden">
      {/* Header без лишних элементов */}
      <Header
        onLogoClick={handleLogoClick}
        onSearchChange={handleSearchChange}
        searchQuery={searchQuery}
      />

      {/* Основной контент - центрированный с отступами */}
      <div className="flex justify-center px-[150px] mt-8">
        <div className="flex gap-8 w-full max-w-[1598px]">
          <ProfileSideBar
            onEditProfile={handleEditProfile}
            onMyAds={handleMyAds}
            onMyCompanies={handleMyCompanies}
            onLogout={handleLogout}
          />
          
          <ProfileEditForm
            initialData={{
              email: 'ivanov@example.com',
              fullName: 'Иванов Иван Иванович',
              phone: '+7 (999) 123-45-67',
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
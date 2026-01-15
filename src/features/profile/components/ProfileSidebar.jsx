// src/features/profile/components/ProfileSideBar.jsx
import React, { useState, useEffect } from 'react';
import api from '@/api/axiosInstance';

const ProfileSideBar = ({
  onEditProfile,
  onMyAds,
  onMyCompanies,
  onLogout
}) => {
  const [userData, setUserData] = useState({
    full_name: 'Загрузка...',
    email: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const DEFAULT_AVATAR = 'http://localhost:9000/buildhub-local-media/users/avatars/default_avatar.jpg';

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user-self/');
      setUserData(response.data);
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
      setError('Не удалось загрузить данные пользователя');
      setUserData({
        full_name: 'Пользователь',
        email: 'Неизвестно',
      });
    } finally {
      setLoading(false);
    }
  };

  // Функция для форматирования ФИО
  const formatFullName = (fullName) => {
    if (!fullName) return ['', ''];
    
    const parts = fullName.split(' ');
    if (parts.length === 1) {
      return [parts[0], ''];
    } else if (parts.length === 2) {
      return [parts[0], parts[1]];
    } else {
      const lastName = parts[0] || '';
      const firstName = parts[1] || '';
      const middleName = parts.slice(2).join(' ') || '';
      return [`${firstName} ${lastName}`, middleName];
    }
  };

  const [firstLine, secondLine] = formatFullName(userData.full_name);

  if (loading) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[383px] h-[860px] gap-16 px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
        style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
      >
        {/* Блок с аватаркой и именем */}
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
          {/* Скелетон для аватара */}
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative">
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
              <div className="w-[230px] h-[230px] rounded-full bg-gray-300 animate-pulse" />
            </div>
          </div>
          
          {/* Скелетон для имени */}
          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
            <div className="h-[43px] w-48 bg-gray-300 rounded animate-pulse" />
          </div>
        </div>
        
        {/* Скелетоны для меню */}
        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5 w-full">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-full h-12 bg-gray-300 rounded-2xl animate-pulse" />
          ))}
        </div>
        
        {/* Скелетон для кнопки выхода */}
        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5 w-full">
          <div className="w-full h-10 bg-gray-300 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-start items-center w-[383px] h-[860px] gap-16 px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Блок с аватаркой и именем */}
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
        {/* Аватарка */}
        <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
            <img
              src={DEFAULT_AVATAR}
              alt="Аватар пользователя"
              className="w-[230px] h-[230px] rounded-full object-cover"
              onError={(e) => {
                console.error('Не удалось загрузить дефолтную аватарку');
                e.target.style.display = 'none';
              }}
            />
          </div>
        </div>
        
        {/* Имя пользователя из API */}
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
          <p className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
            {firstLine && (
              <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
                {firstLine}
              </span>
            )}
            {secondLine && (
              <>
                <br />
                <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
                  {secondLine}
                </span>
              </>
            )}
            {!firstLine && !secondLine && (
              <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
                Пользователь
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Основное меню */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5">
        <button 
          onClick={onEditProfile}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer w-full"
        >
          <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#ff9e00]">
            Редактировать профиль
          </p>
        </button>
        <button 
          onClick={onMyAds}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer w-full"
        >
          <p className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#484848]">
            Мои объявления
          </p>
        </button>
        <button 
          onClick={onMyCompanies}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer w-full"
        >
          <p className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#484848]">
            Мои компании
          </p>
        </button>
      </div>

      {/* Кнопка выхода */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5">
        <button 
          onClick={onLogout}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer w-full"
        >
          <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#4b4b4b]">
            Выйти
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProfileSideBar;
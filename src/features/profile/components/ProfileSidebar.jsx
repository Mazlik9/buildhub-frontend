// src/features/profile/components/ProfileSidebar.jsx
import React, { useState, useEffect, useRef } from 'react';
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
    avatar: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [avatarError, setAvatarError] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  
  const fileInputRef = useRef(null);

  // Очищаем URL предпросмотра при размонтировании
  useEffect(() => {
    return () => {
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
      }
    };
  }, [previewAvatar]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user-self/');
      setUserData(response.data);
      // Сбрасываем предпросмотр при загрузке новых данных
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
        setPreviewAvatar(null);
      }
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
      setError('Не удалось загрузить данные пользователя');
      setUserData({
        full_name: 'Пользователь',
        email: 'Неизвестно',
        avatar: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Обработчик клика на кнопку с карандашом
  const handleAvatarEditClick = () => {
    fileInputRef.current?.click();
  };

  // Обработчик выбора файла
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      setAvatarError('Пожалуйста, выберите изображение');
      return;
    }

    // Проверка размера файла (например, не более 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setAvatarError('Размер файла не должен превышать 5MB');
      return;
    }

    // Создаем URL для предпросмотра
    if (previewAvatar) {
      URL.revokeObjectURL(previewAvatar);
    }
    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatar(previewUrl);
    
    setAvatarLoading(true);
    setAvatarError(null);

    try {
      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('avatar', file);

      // Отправляем запрос на смену аватарки
      await api.patch('/user-self/avatar/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Обновляем данные пользователя с сервера
      await fetchUserData();
      
      // Очищаем input файла
      event.target.value = '';
      
    } catch (err) {
      console.error('Ошибка при обновлении аватарки:', err);
      
      // Отменяем предпросмотр при ошибке
      if (previewAvatar) {
        URL.revokeObjectURL(previewAvatar);
        setPreviewAvatar(null);
      }
      
      // Обработка ошибок
      if (err.response) {
        const { status, data } = err.response;
        
        if (status === 400) {
          if (data.avatar) {
            setAvatarError(data.avatar.join(' '));
          } else if (data.detail) {
            setAvatarError(data.detail);
          } else {
            setAvatarError('Некорректный файл изображения');
          }
        } else if (status === 413) {
          setAvatarError('Файл слишком большой');
        } else if (status === 415) {
          setAvatarError('Неподдерживаемый формат изображения');
        } else {
          setAvatarError('Произошла ошибка при загрузке аватарки');
        }
      } else {
        setAvatarError('Не удалось подключиться к серверу');
      }
      
      // Очищаем input файла при ошибке
      event.target.value = '';
      
    } finally {
      setAvatarLoading(false);
    }
  };

  // Функция для получения URL аватарки с приоритетом предпросмотра
  const getAvatarUrl = () => {
    // Сначала показываем предпросмотр (если есть)
    if (previewAvatar) {
      return previewAvatar;
    }
    // Потом аватар с сервера (бэкенд всегда возвращает валидный URL, даже дефолтный)
    return userData.avatar;
  };

  if (loading) {
    return (
      <div
        className="flex flex-col justify-start items-center w-[383px] h-[860px] gap-16 px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
        style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
      >
        {/* Блок с аватаркой и именем */}
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
          {/* Скелетон для аватара */}
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative gap-10 pl-[169px] pr-3 pt-[174px] pb-[5px]">
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
              <div className="w-[230px] h-[230px] rounded-full bg-gray-300 animate-pulse" />
            </div>
            {/* Скелетон для кнопки редактирования */}
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[52px] h-[52px] relative gap-2.5 p-3 rounded-[26px] bg-gray-300 animate-pulse" />
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
        {/* Контейнер аватарки */}
        <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative gap-10 pl-[169px] pr-3 pt-[174px] pb-[5px]">
          {/* Основная аватарка */}
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
            {/* Простой круглый контейнер для аватарки без обводок */}
            <div className="relative w-[230px] h-[230px]">
              {/* Фоновый круг на случай если аватарка не загрузится */}
              <svg
                width={230}
                height={230}
                viewBox="0 0 230 230"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-[230px] h-[230px]"
                preserveAspectRatio="none"
              >
                {/* Задний фон - светло-серый круг (только если нет аватарки) */}
                {!getAvatarUrl() && (
                  <circle
                    cx="115"
                    cy="115"
                    r="115"
                    fill="#F5F5F5"
                  />
                )}
                
                {/* Маска для круглой аватарки */}
                <defs>
                  <clipPath id="avatarClip">
                    <circle cx="115" cy="115" r="115" />
                  </clipPath>
                </defs>
                
                {/* Аватарка с применением clipPath */}
                <g clipPath="url(#avatarClip)">
                  {getAvatarUrl() && (
                    <image
                      href={getAvatarUrl()}
                      x="0"
                      y="0"
                      width="230"
                      height="230"
                      preserveAspectRatio="xMidYMid cover"
                    />
                  )}
                  
                  {/* Индикатор загрузки */}
                  {avatarLoading && (
                    <rect
                      x="0"
                      y="0"
                      width="230"
                      height="230"
                      fill="rgba(0, 0, 0, 0.5)"
                    >
                      <animate
                        attributeName="fill"
                        values="rgba(0,0,0,0.5);rgba(0,0,0,0.7);rgba(0,0,0,0.5)"
                        dur="1.5s"
                        repeatCount="indefinite"
                      />
                    </rect>
                  )}
                </g>
              </svg>
              
              {/* Индикатор загрузки (альтернативный вариант) */}
              {avatarLoading && (
                <div className="absolute inset-0 flex items-center justify-center z-10">
                  <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Кнопка редактирования аватарки */}
          <button
            onClick={handleAvatarEditClick}
            disabled={avatarLoading}
            className={`flex justify-center items-center flex-grow-0 flex-shrink-0 w-[52px] h-[52px] relative gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] hover:bg-[#ff8c00] active:bg-[#ff7b00] transition-colors cursor-pointer shadow-md ${avatarLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            title="Изменить аватарку"
          >
            <svg
              width={28}
              height={28}
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0"
              preserveAspectRatio="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.01824 21.3048L0.0705036 26.4987C-0.00428869 26.6986 -0.0199663 26.9158 0.0253437 27.1243C0.0706537 27.3329 0.175036 27.524 0.326024 27.6748C0.477012 27.8256 0.668225 27.9298 0.876825 27.9749C1.08543 28.02 1.3026 28.0041 1.5024 27.9291L6.6949 25.9814C7.28922 25.7588 7.82901 25.4116 8.278 24.9631L23.3189 9.92238C23.3189 9.92238 22.7942 8.34968 21.2229 6.77698C19.6517 5.20577 18.0775 4.68104 18.0775 4.68104L3.03658 19.7217C2.58806 20.1707 2.24084 20.7105 2.01824 21.3048ZM20.1749 2.58362L22.225 0.533628C22.5926 0.166023 23.0832 -0.0681775 23.5961 0.0177947C24.318 0.136377 25.4223 0.495088 26.4628 1.53713C27.5049 2.57917 27.8636 3.68199 27.9822 4.40386C28.0682 4.91672 27.834 5.40736 27.4664 5.77496L25.4149 7.82495C25.4149 7.82495 24.8916 6.25374 23.3189 4.68252C21.7477 3.10834 20.1749 2.58362 20.1749 2.58362Z"
                fill="white"
              />
            </svg>
          </button>
          
          {/* Скрытый input для выбора файла */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
            disabled={avatarLoading}
          />
        </div>
        
        {/* Сообщение об ошибке загрузки аватарки */}
        {avatarError && (
          <div className="text-center max-w-[230px] mt-[-15px]">
            <p className="text-red-500 text-sm bg-red-50 px-3 py-1 rounded-lg">
              {avatarError}
            </p>
          </div>
        )}
        
        {/* Имя пользователя из API */}
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
          <p className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
            {userData.full_name || 'Пользователь'}
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
// src/features/profile/components/ProfileEditForm.jsx
import React, { useState, useEffect } from 'react';
import api from '@/api/axiosInstance'; // Импортируем axiosInstance

const ProfileEditForm = ({ onSave, onCancel, onChangePassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    phone: '',
    birthDate: '',
    gender: 'male',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await api.get('/user-self/');
      const userData = response.data;
      
      setFormData({
        email: userData.email || '',
        fullName: userData.full_name || '',
        phone: userData.phone || '',
        birthDate: userData.birth_date || '',
        gender: userData.gender || 'male',
      });
      setError(null);
    } catch (err) {
      console.error('Ошибка загрузки данных пользователя:', err);
      setError('Не удалось загрузить данные пользователя');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGenderChange = (gender) => {
    setFormData(prev => ({
      ...prev,
      gender
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      // Подготовка данных для отправки
      const dataToSend = {
        email: formData.email,
        full_name: formData.fullName,
        phone: formData.phone,
        birth_date: formData.birthDate,
        gender: formData.gender,
      };

      // Отправка данных на сервер
      const response = await api.put('/user-self/', dataToSend);
      
      if (onSave) {
        onSave(response.data);
      }
      setError(null);
    } catch (err) {
      console.error('Ошибка сохранения данных:', err);
      setError(err.response?.data?.message || 'Не удалось сохранить изменения');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    fetchUserData(); // Сброс к исходным данным
    if (onCancel) {
      onCancel();
    }
  };

  if (loading) {
    return (
      <div
        className="flex flex-col justify-center items-center w-[1207px] h-[860px] gap-11 px-[30px] py-10 rounded-[30px] bg-[#ebebeb]"
        style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
      >
        <div className="flex justify-center items-center w-[901px] h-[74px]">
          <div className="w-[728px] h-[43px] bg-gray-300 rounded animate-pulse" />
        </div>
        
        <div className="flex justify-center items-center gap-3.5">
          <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
          <div className="w-32 h-6 bg-gray-300 rounded animate-pulse" />
        </div>
        
        <div className="flex flex-col justify-center items-center h-64 w-[900px] gap-5 p-2.5">
          {[1, 2, 3].map((item) => (
            <div key={item} className="w-full h-14 bg-gray-300 rounded-lg animate-pulse" />
          ))}
        </div>
        
        <div className="w-[660px] h-10 bg-gray-300 rounded animate-pulse" />
        
        <div className="flex justify-center items-center w-[660px] gap-10">
          <div className="w-[304.3px] h-12 bg-gray-300 rounded-2xl animate-pulse" />
          <div className="w-[304.3px] h-12 bg-gray-300 rounded-2xl animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="flex flex-col justify-center items-center w-[1207px] h-[860px] gap-11 px-[30px] py-10 rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Заголовок */}
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[901px] h-[74px] relative gap-2.5">
        <p className="flex-grow-0 flex-shrink-0 w-[728px] h-[43px] text-[32px] font-bold text-center text-black">
          Персональная информация
        </p>
      </div>

      {/* Выбор пола */}
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-3.5">
        <button 
          onClick={() => handleGenderChange('male')}
          className={`flex items-center gap-2 ${formData.gender === 'male' ? 'opacity-100' : 'opacity-70'} hover:opacity-100 transition-opacity cursor-pointer`}
        >
          <p className="w-[79.12px] text-base text-left text-black">Мужчина</p>
          <svg
            width={26}
            height={25}
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[24.34px] h-6"
            preserveAspectRatio="xMidYMid meet"
          >
            <ellipse 
              cx="12.6719" 
              cy="12.5" 
              rx="12.1719" 
              ry={12} 
              fill="white" 
              stroke={formData.gender === 'male' ? "#FCA311" : "#D1D1D1"} 
              strokeWidth="2"
            />
            {formData.gender === 'male' && (
              <ellipse cx="12.6718" cy="12.5" rx="7.10029" ry={7} fill="#FF9E00" />
            )}
          </svg>
        </button>
        
        <button 
          onClick={() => handleGenderChange('female')}
          className={`flex items-center gap-2 ${formData.gender === 'female' ? 'opacity-100' : 'opacity-70'} hover:opacity-100 transition-opacity cursor-pointer`}
        >
          <p className="w-[84.19px] text-base text-left text-black">Женщина</p>
          <svg
            width={26}
            height={25}
            viewBox="0 0 26 25"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="w-[24.34px] h-6"
            preserveAspectRatio="xMidYMid meet"
          >
            <ellipse 
              cx="12.6719" 
              cy="12.5" 
              rx="12.1719" 
              ry={12} 
              fill="white" 
              stroke={formData.gender === 'female' ? "#FCA311" : "#D1D1D1"} 
              strokeWidth="2"
            />
            {formData.gender === 'female' && (
              <ellipse cx="12.6718" cy="12.5" rx="7.10029" ry={7} fill="#FF9E00" />
            )}
          </svg>
        </button>
      </div>

      {/* Форма ввода */}
      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-64 w-[900px] gap-5 p-2.5">
        {/* Email */}
        <div
          className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[3px]"
          style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
        >
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
            <div className="flex flex-col justify-start items-start flex-grow w-full">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative w-full">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent border-none outline-none w-full placeholder-gray-400"
                  placeholder="Введите email"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ФИО */}
        <div
          className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[3px]"
          style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
        >
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
            <div className="flex flex-col justify-start items-start flex-grow w-full">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative w-full">
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent border-none outline-none w-full placeholder-gray-400"
                  placeholder="Введите ФИО"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Номер телефона и Дата рождения */}
        <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[660px] gap-20 p-2.5">
          {/* Номер телефона */}
          <div
            className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[400px] gap-[3px]"
            style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
              <div className="flex flex-col justify-start items-start flex-grow w-full">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative w-full">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent border-none outline-none w-full placeholder-gray-400"
                    placeholder="Введите номер телефона"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Дата рождения */}
          <div
            className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[400px] gap-[3px]"
            style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
              <div className="flex flex-col justify-start items-start flex-grow w-full">
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative w-full">
                  <input
                    type="date"
                    name="birthDate"
                    value={formData.birthDate}
                    onChange={handleInputChange}
                    className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent border-none outline-none w-full placeholder-gray-400"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Ссылка на смену пароля */}
      <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 w-[660px] relative gap-5">
        <button
          onClick={onChangePassword}
          className="flex-grow-0 flex-shrink-0 w-[140.99px] text-base font-medium text-center text-[#fca311] hover:text-[#e68a00] transition-colors cursor-pointer"
        >
          Сменить пароль
        </button>
      </div>

      {/* Кнопки действий */}
      <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[660px] gap-10">
        {/* Кнопка отмены */}
        <button
          onClick={handleCancel}
          disabled={loading}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[304.3px] relative gap-4 px-6 py-4 rounded-2xl border-2 border-[#fca311] hover:bg-[#fff5e6] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-center text-[#ff9e00]">
            {loading ? 'Отмена...' : 'Отменить изменения'}
          </p>
        </button>

        {/* Кнопка сохранения */}
        <button
          onClick={handleSave}
          disabled={loading}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[304.3px] relative gap-4 px-6 py-4 rounded-2xl bg-[#fca311] hover:bg-[#e68a00] transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ boxShadow: "0px 0px 12px 0 rgba(252,163,17,0.5)" }}
        >
          <p className="flex-grow-0 flex-shrink-0 text-base font-black text-left text-white">
            {loading ? 'Сохранение...' : 'Сохранить изменения'}
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProfileEditForm;
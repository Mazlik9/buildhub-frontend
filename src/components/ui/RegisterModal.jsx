// src/components/ui/RegisterModal.jsx
import { useState, useEffect } from 'react';

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Форма регистрации отправлена:', formData);
    // Здесь будет твоя логика регистрации
  };

  // Закрытие по Esc
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Блокировка скролла
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      onClick={onClose}
    >
      <div
        className="
          relative w-[92%] sm:w-[85%] md:w-[75%] lg:max-w-[777px]
          min-h-[70vh] max-h-[92vh] overflow-y-auto
          bg-white/80 backdrop-blur-[12.5px]
          rounded-2xl sm:rounded-[30px]
          shadow-[0_4px_20px_rgba(0,0,0,0.6)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 sm:right-[17px] sm:top-[17px]
            w-10 h-10 sm:w-[59px] sm:h-[59px]
            bg-[#E4E4E4] rounded-full
            shadow-[0_0_4px_rgba(0,0,0,0.25)]
            flex items-center justify-center
            hover:bg-[#D8D8D8] transition-colors
            z-20
          "
          aria-label="Закрыть"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none" className="sm:w-5 sm:h-5 pointer-events-none">
            <path
              d="M1 1L19 19M19 1L1 19"
              stroke="#BFBFBF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Контент */}
        <div className="px-6 pt-16 pb-10 sm:px-12 md:px-[142px] sm:pt-20 md:pt-24">
          {/* Заголовок */}
          <h2 className="text-4xl sm:text-5xl md:text-[48px] font-bold text-black text-center mb-8 sm:mb-10 md:mb-12">
            Регистрация
          </h2>

          {/* Форма — здесь был баг: открывалась, но не закрывалась */}
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 max-w-[492px] mx-auto">
            {/* ФИО */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="ФИО"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 bg-white text-base text-[#484848] placeholder:text-[#484848]/70 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                required
              />
            </div>

            {/* Email */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Email"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 bg-white text-base text-[#484848] placeholder:text-[#484848]/70 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                required
              />
            </div>

            {/* Телефон */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="Телефон"
                className="w-full h-12 sm:h-14 px-5 sm:px-6 bg-white text-base text-[#484848] placeholder:text-[#484848]/70 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                required
              />
            </div>

            {/* Пароль */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Пароль"
                  className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-12 sm:pr-14 bg-white text-base text-[#484848] placeholder:text-[#484848]/70 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Повтор пароля */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <div className="relative flex items-center">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Повтор пароля"
                  className="w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-12 sm:pr-14 bg-white text-base text-[#484848] placeholder:text-[#484848]/70 focus:outline-none focus:ring-2 focus:ring-orange-400/30"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showConfirmPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="sm:w-[22px] sm:h-[22px]">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Кнопка "Зарегистрироваться" */}
            <div className="mt-10 sm:mt-12 flex justify-center px-6 sm:px-12 md:px-[142px]">
              <button
                type="submit"
                className="
                  w-full md:w-[984px] px-6 py-4
                  bg-[#FCA311] shadow-[0_0_12px_#FCA311]
                  rounded-2xl flex items-center justify-center
                  text-white text-base sm:text-lg font-black font-montserrat leading-6
                  hover:bg-[#F59E0B] transition-colors active:scale-[0.98]
                "
              >
                Зарегистрироваться
              </button>
            </div>

            {/* Нижний блок "У вас уже есть аккаунт? Войти" */}
            <div className="mt-6 sm:mt-8 flex justify-center px-6 sm:px-12 md:px-[142px]">
              <div className="flex flex-col sm:flex-row items-center gap-2 text-sm text-center">
                <span className="text-black font-normal font-montserrat leading-6">
                  У вас уже есть аккаунт?
                </span>
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="
                    text-[#FF9E00] text-sm font-normal font-montserrat underline leading-6
                    hover:opacity-80 transition-opacity
                  "
                >
                  Войти
                </button>
              </div>
            </div>
          </form>  {/* ← Вот этот закрывающий тег был пропущен — теперь всё ок */}
        </div>
      </div>
    </div>
  );
}
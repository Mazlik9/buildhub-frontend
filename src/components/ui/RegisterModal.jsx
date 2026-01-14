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
    // Здесь будет логика отправки на сервер
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

  // Блокировка скролла страницы
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="
          relative 
          w-[92%] sm:w-[85%] md:w-[668px] lg:w-[668px]
          min-h-[50vh] sm:min-h-[60vh] md:min-h-[859px] lg:min-h-[859px]  /* адаптивная высота */
          max-h-[92vh] lg:max-h-[90vh]
          bg-white/90 backdrop-blur-xl
          rounded-3xl shadow-2xl overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия — как в AuthModal */}
        <button
          onClick={onClose}
          className="
            absolute right-5 top-5 
            w-10 h-10 rounded-full 
            bg-gray-100 hover:bg-gray-200 
            flex items-center justify-center 
            transition-all duration-200
            shadow-[0_4px_12px_rgba(0,0,0,0.3)]           /* тень 30% — заметная, но мягкая */
            hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]     /* усиление при наведении */
            active:scale-95                               /* лёгкое нажатие */
            z-10
          "
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Контент с возможностью скролла внутри */}
        <div className="flex flex-col items-center pt-16 pb-16 md:pt-20 lg:pt-24 px-6 sm:px-12 md:px-16 overflow-y-auto max-h-[85vh]">
          {/* Заголовок */}
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-center text-black mb-4">
            Регистрация
          </h2>

          {/* Подзаголовок */}
          <p className="text-center text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-[400px]">
            заполните все поля для создания аккаунта
          </p>

          {/* Форма */}
          <div className="w-full max-w-[328px] space-y-5 flex flex-col items-center">
            {/* ФИО */}
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="ФИО"
              className="
                w-full h-[56px] px-6 
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
              required
            />

            {/* Email */}
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Email"
              className="
                w-full h-[56px] px-6 
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
              required
            />

            {/* Телефон */}
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="Телефон"
              className="
                w-full h-[56px] px-6 
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
              required
            />

            {/* Пароль */}
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Пароль"
                className="
                  w-full h-[56px] pl-6 pr-14
                  bg-white border border-gray-300 rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                  transition-all
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            {/* Повтор пароля */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                placeholder="Повтор пароля"
                className="
                  w-full h-[56px] pl-6 pr-14
                  bg-white border border-gray-300 rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                  transition-all
                "
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                ) : (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                )}
              </button>
            </div>

            {/* Кнопка Зарегистрироваться + ссылка */}
            <div className="w-full mt-8 space-y-4">
              <button
                type="submit"
                className="
                  w-full h-[56px]
                  bg-[#FCA311] hover:bg-[#f59e0b] active:bg-[#e69500]
                  text-white font-bold text-lg rounded-xl
                  shadow-md hover:shadow-lg transition-all duration-200
                "
              >
                Зарегистрироваться
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#FCA311] text-sm font-medium hover:underline transition-colors"
                >
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
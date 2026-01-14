// src/components/ui/AuthModal.jsx
import { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  // Закрытие по Esc + блокировка скролла (без изменений)
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

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
          min-h-[70vh] md:min-h-[859px] lg:min-h-[859px]
          max-h-[92vh] lg:max-h-[90vh]
          bg-white/90 backdrop-blur-xl
          rounded-3xl shadow-2xl overflow-hidden
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
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

        {/* Контент с более высоким позиционированием сверху и воздухом снизу */}
        <div className="flex flex-col items-center pt-24 md:pt-45 lg:pt-45 pb-16 md:pb-20 lg:pb-24 px-6 sm:px-12 md:px-16">
          {/* Заголовок */}
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-center text-black mb-4">
            Авторизация
          </h2>

          {/* Подзаголовок */}
          <p className="text-center text-gray-500 text-base md:text-lg mb-10 md:mb-12 leading-relaxed max-w-[400px]">
            для входа необходимо ввести<br className="sm:hidden" /> номер телефона и пароль
          </p>

          {/* Форма и кнопки */}
          <div className="w-full max-w-[328px] space-y-5 flex flex-col items-center">
            {/* Поле Телефон / Email */}
            <input
              type="text"
              placeholder="Телефон или email"
              className="
                w-full h-[56px] px-6 
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
            />

            {/* Поле Пароль */}
            <div className="relative w-full">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                className="
                  w-full h-[56px] pl-6 pr-14
                  bg-white border border-gray-300 rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                  transition-all
                "
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

            {/* Забыли пароль? */}
            <div className="w-full text-right mt-1 mb-3">
              <a href="#" className="text-gray-500 text-sm hover:underline hover:text-orange-600 transition-colors">
                Забыли пароль?
              </a>
            </div>

            {/* Кнопки */}
            <div className="w-full space-y-4">
              <button
                className="
                  w-full h-[56px]
                  bg-[#FCA311] hover:bg-[#f59e0b] active:bg-[#e69500]
                  text-white font-bold text-lg rounded-xl
                  shadow-md hover:shadow-lg transition-all duration-200
                "
              >
                Войти
              </button>

              <button
                onClick={onSwitchToRegister}
                className="
                  w-full h-[56px]
                  border-2 border-[#FCA311] hover:bg-[#FFF7EB]
                  text-[#FCA311] font-medium text-lg rounded-xl
                  transition-all duration-200
                "
              >
                Зарегистрироваться
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
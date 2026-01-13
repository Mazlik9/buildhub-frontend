// src/components/ui/AuthModal.jsx
import { useState, useEffect } from 'react';

export default function AuthModal({ isOpen, onClose, onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);

  // Закрытие по Escape
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
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"
      onClick={onClose}
    >
      <div
        className="
          relative w-[90%] max-w-[668px]     // ← адаптивная ширина
          min-h-[70vh] max-h-[90vh]          // ← гибкая высота + скролл
          overflow-y-auto                    // скролл при большом контенте
          bg-white/80 backdrop-blur-[12.5px]
          rounded-2xl sm:rounded-[30px]      // меньшие скругления на мобильных
          shadow-[0_4px_20px_rgba(0,0,0,0.6)]
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Кнопка закрытия */}
        <button
          onClick={onClose}
          className="
            absolute right-4 top-4 sm:right-[17px] sm:top-[17px]
            w-10 h-10 sm:w-[51px] sm:h-[51px]  // меньше на мобильных
            bg-[#E4E4E4] rounded-full
            shadow-[0_0_4px_rgba(0,0,0,0.25)]
            flex items-center justify-center
            hover:bg-[#D8D8D8] transition-colors
            z-20
          "
          aria-label="Закрыть"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 18 18"
            fill="none"
            className="sm:w-5 sm:h-5 pointer-events-none"
          >
            <path
              d="M1 1L17 17M17 1L1 17"
              stroke="#BFBFBF"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Основной контент — адаптивные отступы */}
        <div className="px-6 pt-20 pb-10 sm:px-[170px] sm:pt-[159px] sm:pb-12">
          {/* Заголовок */}
          <h2 className="text-4xl sm:text-[48px] font-bold text-black text-center mb-4 sm:mb-6">
            Авторизация
          </h2>

          {/* Подзаголовок */}
          <p className="text-center text-[#818181] text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            для входа необходимо ввести<br />
            номер телефона и пароль
          </p>

          {/* Поля ввода */}
          <div className="space-y-5 sm:space-y-6">
            {/* Телефон или email */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Телефон или email"
                className="
                  w-full h-12 sm:h-14 px-5 sm:px-6
                  bg-white text-base text-[#484848]
                  placeholder:text-[#484848]/70
                  focus:outline-none focus:ring-2 focus:ring-orange-400/30
                "
              />
            </div>

            {/* Пароль */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  className="
                    w-full h-12 sm:h-14 pl-5 sm:pl-6 pr-12 sm:pr-14
                    bg-white text-base text-[#484848]
                    placeholder:text-[#484848]/70
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  ) : (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Забыли пароль? */}
          <div className="mt-3 text-center sm:text-left">
            <a href="#" className="text-[#818181] text-sm hover:underline">
              Забыли пароль?
            </a>
          </div>

          {/* Кнопки */}
          <div className="mt-8 sm:mt-12 space-y-4">
            <button
              className="
                w-full px-6 py-4 sm:py-4
                bg-[#FCA311] shadow-[0_0_12px_#FCA311]
                rounded-2xl flex items-center justify-center
                text-white text-base font-black font-montserrat leading-6
                hover:bg-[#F59E0B] transition-colors active:scale-[0.98]
              "
            >
              Войти
            </button>

            <button
              onClick={onSwitchToRegister}
              className="
                w-full px-6 py-4 sm:py-4
                border border-[#FCA311] rounded-2xl
                flex items-center justify-center
                hover:bg-[#FFF7EB] transition-colors
              "
            >
              <span className="text-[#FF9E00] text-sm font-normal font-montserrat underline leading-6">
                Зарегистрироваться
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
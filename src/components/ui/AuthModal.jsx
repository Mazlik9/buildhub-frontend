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
      className="fixed inset-0 z-50 flex items-center justify-center bg-transparent"  // ← полностью прозрачный фон
      onClick={onClose}
    >
    <div
      className="
        relative w-full max-w-[668px] h-[859px]
        bg-white/40                      // ← 80% прозрачности (20% непрозрачности)
        backdrop-blur-[12.5px]           // размытие остаётся для стеклянного эффекта
        rounded-[30px]
        shadow-[0_4px_20px_rgba(0,0,0,0.6)]
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >
        {/* Круглая кнопка закрытия 51×51 */}
        <button
          onClick={onClose}
          className="
            absolute right-[17px] top-[17px]
            w-[51px] h-[51px]
            bg-[#E4E4E4] rounded-full
            shadow-[0_0_4px_rgba(0,0,0,0.25)]
            flex items-center justify-center
            hover:bg-[#D8D8D8] transition-colors
            focus:outline-none focus:ring-2 focus:ring-gray-400
            z-20  /* повышаем z-index на всякий случай */
          "
          aria-label="Закрыть модальное окно"
        >
          {/* Крестик 18×18, цвет #BFBFBF, строго по центру */}
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="pointer-events-none"  /* предотвращаем перехват клика самим SVG */
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

        {/* Основной контент */}
        <div className="absolute inset-0 px-[170px] pt-[159px]">
          <h2 className="text-[48px] font-bold text-black text-center mb-6">
            Авторизация
          </h2>

          <p className="text-center text-[#818181] text-lg mb-10 leading-relaxed">
            для входа необходимо ввести<br />
            номер телефона и пароль
          </p>

          <div className="space-y-6">
            {/* Поле Телефон или email */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <input
                type="text"
                placeholder="Телефон или email"
                className="
                  w-full h-14 px-6
                  bg-white text-[#484848] text-base
                  placeholder:text-[#484848]/70
                  focus:outline-none focus:ring-2 focus:ring-orange-400/30
                "
              />
            </div>

            {/* Поле Пароль */}
            <div className="shadow-[0_4px_16px_rgba(0,0,0,0.25)] rounded-lg overflow-hidden">
              <div className="relative flex items-center">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  className="
                    w-full h-14 pl-6 pr-14
                    bg-white text-[#484848] text-base
                    placeholder:text-[#484848]/70
                    focus:outline-none focus:ring-2 focus:ring-orange-400/30
                  "
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 text-gray-600 hover:text-gray-900"
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
            </div>
          </div>

          {/* Забыли пароль? */}
          <div className="mt-3">
            <a href="#" className="text-[#818181] text-sm hover:underline">
              Забыли пароль?
            </a>
          </div>

          {/* Кнопки */}
          <div className="mt-12 space-y-4">
            <button
              className="
                w-[328px] px-6 py-4
                bg-[#FCA311] 
                shadow-[0_0_12px_#FCA311]
                rounded-2xl
                flex items-center justify-center
                text-white text-base font-black font-montserrat
                leading-6
                hover:bg-[#F59E0B] transition-colors
                active:scale-[0.98]
              "
            >
              Войти
            </button>
            <button
              onClick={onSwitchToRegister}   // ← вот это ключевое
              className="
                w-[328px] px-6 py-4
                border border-[#FCA311] rounded-2xl
                relative flex items-center justify-center
                hover:bg-[#FFF7EB] transition-colors
              "
            >
              <span
              className="
                text-[#FF9E00] text-sm font-normal font-montserrat
                underline leading-6
              "
            >
              Зарегистрироваться
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
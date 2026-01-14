// src/components/ui/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { loginUser } from '@/api/authApi';

// Схема валидации для логина
const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин или email'),
  password: z.string().min(1, 'Введите пароль'),
});

export default function AuthModal({ isOpen, onClose, onSwitchToRegister }) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

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

  const onSubmit = async (data) => {
    setIsLoading(true);

    try {
      const response = await loginUser({
        login: data.login,    // может быть email или username
        password: data.password,
      });

      // Сохраняем токены и данные пользователя
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);
      
      // Опционально: сохраняем данные пользователя (для быстрого доступа)
      localStorage.setItem('userData', JSON.stringify({
        email: response.email,
        phone: response.phone,
        full_name: response.full_name,
      }));

      toast.success(`Добро пожаловать, ${response.full_name}!`);
      reset(); // очищаем форму
      onClose();

      // Опционально: перезагрузка или обновление состояния
      // window.location.reload();
    } catch (error) {
      const message =
        error.response?.data?.detail ||
        error.response?.data?.login?.[0] ||
        error.response?.data?.password?.[0] ||
        error.message ||
        'Ошибка входа. Проверьте логин и пароль.';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

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
          min-h-[50vh] sm:min-h-[60vh] md:min-h-[859px] lg:min-h-[859px]
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
            shadow-[0_4px_12px_rgba(0,0,0,0.3)]
            hover:shadow-[0_6px_16px_rgba(0,0,0,0.4)]
            active:scale-95
            z-10
          "
          aria-label="Закрыть"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Контент */}
        <div className="flex flex-col items-center pt-16 pb-16 md:pt-20 lg:pt-24 px-6 sm:px-12 md:px-16 overflow-y-auto max-h-[85vh]">
          <h2 className="text-3xl sm:text-4xl md:text-[42px] font-bold text-center text-black mb-4">
            Авторизация
          </h2>

          <p className="text-center text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-[400px]">
            для входа необходимо ввести номер телефона и пароль
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[328px] space-y-5">
            {/* Поле Логин (телефон или email) */}
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
              {...register('login')}
            />
            {errors.login && (
              <p className="text-red-500 text-sm mt-1">{errors.login.message}</p>
            )}

            {/* Поле Пароль */}
            <div className="relative">
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
                {...register('password')}
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
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}

            {/* Забыли пароль? */}
            <div className="w-full text-right mt-2">
              <a href="#" className="text-gray-500 text-sm hover:underline hover:text-orange-600 transition-colors">
                Забыли пароль?
              </a>
            </div>

            {/* Кнопки */}
            <div className="w-full mt-8 space-y-4">
              <button
                type="submit"
                disabled={isLoading}
                className="
                  w-full h-[56px]
                  bg-[#FCA311] hover:bg-[#f59e0b] active:bg-[#e69500]
                  text-white font-bold text-lg rounded-xl
                  shadow-md hover:shadow-lg transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                {isLoading ? 'Вход...' : 'Войти'}
              </button>

              <button
                onClick={onSwitchToRegister}
                disabled={isLoading}
                className="
                  w-full h-[56px]
                  border-2 border-[#FCA311] hover:bg-[#FFF7EB]
                  text-[#FCA311] font-medium text-lg rounded-xl
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                "
              >
                Зарегистрироваться
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
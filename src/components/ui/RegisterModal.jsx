// src/components/ui/RegisterModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { registerUser } from '@/api/authApi';  // ← используем твой готовый файл!

// Схема валидации (zod)
const registerSchema = z.object({
  full_name: z.string().min(2, 'Введите полное имя'),
  email: z.string().email('Некорректный email'),
  password: z.string().min(6, 'Пароль минимум 6 символов'),
  password2: z.string(),
}).refine((data) => data.password === data.password2, {
  message: 'Пароли не совпадают',
  path: ['password2'],
});

export default function RegisterModal({ isOpen, onClose, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(registerSchema),
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
      const response = await registerUser({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        password2: data.password2,
      });

      // Сохраняем токены из ответа бэкенда
      localStorage.setItem('accessToken', response.access);
      localStorage.setItem('refreshToken', response.refresh);

      toast.success('Регистрация успешна! Вы вошли в систему.');
      reset(); // очищаем форму
      onClose();

      // Опционально: можно перезагрузить страницу или обновить глобальное состояние
      // window.location.reload();
    } catch (error) {
      // Обрабатываем ошибку от бэкенда
      const message =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        error.response?.data?.password?.[0] ||
        error.message ||
        'Ошибка регистрации. Попробуйте позже.';
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
            Регистрация
          </h2>

          <p className="text-center text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-[400px]">
            заполните все поля для создания аккаунта
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full max-w-[328px] space-y-5">
            {/* ФИО */}
            <input
              type="text"
              placeholder="ФИО"
              className="
                w-full h-[56px] px-6
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
              {...register('full_name')}
            />
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
            )}

            {/* Email */}
            <input
              type="email"
              placeholder="Email"
              className="
                w-full h-[56px] px-6
                bg-white border border-gray-300 rounded-xl
                text-base text-gray-800 placeholder:text-gray-400
                focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                transition-all
              "
              {...register('email')}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}

            {/* Пароль */}
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

            {/* Повтор пароля */}
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Повтор пароля"
                className="
                  w-full h-[56px] pl-6 pr-14
                  bg-white border border-gray-300 rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-400/30
                  transition-all
                "
                {...register('password2')}
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
            {errors.password2 && (
              <p className="text-red-500 text-sm mt-1">{errors.password2.message}</p>
            )}

            {/* Кнопка Зарегистрироваться */}
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
                {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
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
          </form>
        </div>
      </div>
    </div>
  );
}
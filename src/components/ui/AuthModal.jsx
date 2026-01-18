// src/components/ui/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { authService, setAuthTokens } from '@/api'; // Импортируем из новой структуры

// Валидация формы
const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин или email'),
  password: z.string().min(1, 'Введите пароль'),
});

export default function AuthModal({ 
  isOpen, 
  onClose, 
  onSwitchToRegister,
  onSuccessfulLogin
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      login: '',
      password: '',
    }
  });

  // Закрытие по Esc
  useEffect(() => {
    if (!isOpen) return;
    
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  // Блокировка скролла и фокусировка
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      // Фокусируемся на поле ввода после открытия
      setTimeout(() => {
        setFocus('login');
      }, 100);
    } else {
      document.body.style.overflow = '';
      // Сбрасываем форму при закрытии
      reset();
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, reset, setFocus]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      // Используем новую структуру - authService.login
      const response = await authService.login({
        login: data.login,
        password: data.password,
      });

      // ✅ Используем setAuthTokens вместо прямого localStorage
      if (response.access && response.refresh) {
        setAuthTokens(response.access, response.refresh);
      } else {
        // Если токены не пришли в ответе, пробуем получить JWT отдельно
        try {
          // Используем JWT сервис для получения токенов
          const jwtResponse = await authService.loginWithJWT?.({
            login: data.login,
            password: data.password,
          });
          
          if (jwtResponse?.tokens) {
            setAuthTokens(jwtResponse.tokens.access, jwtResponse.tokens.refresh);
          }
        } catch (jwtError) {
          console.warn('Не удалось получить JWT токены:', jwtError);
          // Продолжаем без JWT токенов
        }
      }

      // ❌ УБИРАЕМ сохранение userData в localStorage
      // localStorage.setItem('userData', JSON.stringify({ ... }));
      // Вместо этого будем хранить в состоянии React/Context

      toast.success(`Добро пожаловать, ${response.full_name || 'пользователь'}!`);
      
      // Сбрасываем форму
      reset();
      
      // Закрываем модалку
      onClose();

      // Вызываем callback для обновления состояния в Header
      if (onSuccessfulLogin) {
        onSuccessfulLogin({
          email: response.email,
          phone: response.phone || '',
          full_name: response.full_name,
          avatar: response.avatar || null
        });
      }

    } catch (error) {
      // Улучшенная обработка ошибок
      let errorMessage = 'Ошибка входа. Проверьте логин и пароль.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            // Обработка ошибок валидации Django
            if (data.detail) {
              errorMessage = data.detail;
            } else if (data.non_field_errors) {
              errorMessage = data.non_field_errors.join(', ');
            } else if (data.login) {
              errorMessage = Array.isArray(data.login) ? data.login[0] : data.login;
            } else if (data.password) {
              errorMessage = Array.isArray(data.password) ? data.password[0] : data.password;
            }
            break;
            
          case 401:
            errorMessage = 'Неверный логин или пароль';
            break;
            
          case 403:
            errorMessage = 'Доступ запрещен. Аккаунт может быть заблокирован.';
            break;
            
          case 429:
            errorMessage = 'Слишком много попыток входа. Попробуйте позже.';
            break;
            
          case 500:
            errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
            break;
            
          default:
            if (status >= 500) {
              errorMessage = 'Ошибка сервера. Пожалуйста, попробуйте позже.';
            } else if (data.detail) {
              errorMessage = data.detail;
            }
        }
      } else if (error.request) {
        // Ошибка сети
        errorMessage = 'Нет соединения с сервером. Проверьте подключение к интернету.';
      } else {
        // Ошибка настройки запроса
        errorMessage = error.message || 'Ошибка при отправке запроса';
      }
      
      toast.error(errorMessage);
      
      // Фокусируемся на поле логина при ошибке
      setTimeout(() => {
        setFocus('login');
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    toast.info('Функция восстановления пароля будет доступна в ближайшее время');
    // TODO: Реализовать восстановление пароля
  };

  // Рендерим null если модалка закрыта
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
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
          disabled={isLoading}
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
            disabled:opacity-50 disabled:cursor-not-allowed
          "
          aria-label="Закрыть окно авторизации"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Контент */}
        <div className="flex flex-col items-center pt-16 pb-16 md:pt-20 lg:pt-24 px-6 sm:px-12 md:px-16 overflow-y-auto max-h-[85vh]">
          <h2 
            id="auth-modal-title"
            className="text-3xl sm:text-4xl md:text-[42px] font-bold text-center text-black mb-4"
          >
            Авторизация
          </h2>

          <p className="text-center text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-[400px]">
            для входа необходимо ввести номер телефона и пароль
          </p>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="w-full max-w-[328px] space-y-5"
            noValidate
          >
            {/* Поле Логин */}
            <div>
              <input
                type="text"
                placeholder="Телефон или email"
                className={`
                  w-full h-[56px] px-6
                  bg-white border rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-orange-400/50
                  transition-all
                  ${errors.login 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:border-orange-400'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                {...register('login')}
                disabled={isLoading}
                aria-invalid={errors.login ? "true" : "false"}
                aria-describedby={errors.login ? "login-error" : undefined}
              />
              {errors.login && (
                <p id="login-error" className="text-red-500 text-sm mt-2">
                  {errors.login.message}
                </p>
              )}
            </div>

            {/* Поле Пароль */}
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Пароль"
                  className={`
                    w-full h-[56px] pl-6 pr-14
                    bg-white border rounded-xl
                    text-base text-gray-800 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-orange-400/50
                    transition-all
                    ${errors.password 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'border-gray-300 focus:border-orange-400'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  {...register('password')}
                  disabled={isLoading}
                  aria-invalid={errors.password ? "true" : "false"}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
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
                <p id="password-error" className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Забыли пароль? */}
            <div className="w-full text-right mt-2">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-gray-500 text-sm hover:underline hover:text-orange-600 transition-colors disabled:opacity-50"
                disabled={isLoading}
              >
                Забыли пароль?
              </button>
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
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                "
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg 
                      className="animate-spin h-5 w-5 text-white" 
                      xmlns="http://www.w3.org/2000/svg" 
                      fill="none" 
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        className="opacity-25" 
                        cx="12" cy="12" r="10" 
                        stroke="currentColor" 
                        strokeWidth="4"
                      ></circle>
                      <path 
                        className="opacity-75" 
                        fill="currentColor" 
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Вход...
                  </span>
                ) : 'Войти'}
              </button>

              <button
                type="button"
                onClick={onSwitchToRegister}
                disabled={isLoading}
                className="
                  w-full h-[56px]
                  border-2 border-[#FCA311] hover:bg-[#FFF7EB]
                  text-[#FCA311] font-medium text-lg rounded-xl
                  transition-all duration-200
                  disabled:opacity-50 disabled:cursor-not-allowed
                  focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-offset-2
                "
              >
                Зарегистрироваться
              </button>
            </div>
          </form>

          {/* Дополнительная информация */}
          <div className="mt-10 text-center text-sm text-gray-400 max-w-[400px]">
            <p>Нажимая "Войти", вы соглашаетесь с нашими условиями использования</p>
          </div>
        </div>
      </div>
    </div>
  );
}
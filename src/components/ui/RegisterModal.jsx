// src/components/ui/RegisterModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { authService, setAuthTokens } from '@/api'; // Импортируем из новой структуры

// Схема валидации
const registerSchema = z.object({
  full_name: z.string()
    .min(2, 'Введите полное имя (минимум 2 символа)')
    .max(100, 'Слишком длинное имя (максимум 100 символов)'),
  email: z.string()
    .email('Некорректный email')
    .min(5, 'Email слишком короткий')
    .max(255, 'Слишком длинный email'),
  password: z.string()
    .min(6, 'Пароль должен содержать минимум 6 символов')
    .max(128, 'Пароль слишком длинный')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Пароль должен содержать хотя бы одну заглавную букву, одну строчную букву и одну цифру'
    ),
  password2: z.string(),
}).refine((data) => data.password === data.password2, {
  message: 'Пароли не совпадают',
  path: ['password2'],
});

export default function RegisterModal({ 
  isOpen, 
  onClose, 
  onSwitchToLogin,
  onSuccessfulRegistration // Можно добавить callback как в AuthModal
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
    watch,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      password: '',
      password2: '',
    }
  });

  // Следим за паролем для отображения силы
  const password = watch('password', '');

  useEffect(() => {
    // Простая проверка силы пароля
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    
    setPasswordStrength(strength);
  }, [password]);

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
        setFocus('full_name');
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
      // Используем новую структуру - authService.register
      const response = await authService.register({
        email: data.email,
        full_name: data.full_name,
        password: data.password,
        password2: data.password2,
      });

      // ✅ Используем setAuthTokens вместо прямого localStorage
      if (response.access && response.refresh) {
        setAuthTokens(response.access, response.refresh);
      } else {
        console.warn('Токены не получены при регистрации. Возможно, их нужно получить отдельно.');
      }

      toast.success(`Регистрация успешна! Добро пожаловать, ${response.full_name || 'пользователь'}!`);
      
      // Сбрасываем форму
      reset();
      
      // Закрываем модалку
      onClose();

      // Вызываем callback, если передан (аналогично AuthModal)
      if (onSuccessfulRegistration) {
        onSuccessfulRegistration({
          email: response.email,
          full_name: response.full_name,
          // Другие поля, если они есть в ответе
        });
      }

      // Редирект на профиль (или другую страницу)
      setTimeout(() => {
        navigate('/profile');
      }, 1500);

    } catch (error) {
      // Улучшенная обработка ошибок
      let errorMessage = 'Ошибка регистрации. Попробуйте позже.';
      
      if (error.response) {
        const { status, data } = error.response;
        
        switch (status) {
          case 400:
            // Обработка ошибок валидации Django
            if (data.detail) {
              errorMessage = data.detail;
            } else if (data.non_field_errors) {
              errorMessage = data.non_field_errors.join(', ');
            } else if (data.email) {
              errorMessage = Array.isArray(data.email) ? data.email[0] : data.email;
            } else if (data.full_name) {
              errorMessage = Array.isArray(data.full_name) ? data.full_name[0] : data.full_name;
            } else if (data.password) {
              errorMessage = Array.isArray(data.password) ? data.password[0] : data.password;
            } else if (data.password2) {
              errorMessage = Array.isArray(data.password2) ? data.password2[0] : data.password2;
            } else if (typeof data === 'object') {
              // Показываем первую ошибку
              const firstErrorKey = Object.keys(data)[0];
              const firstError = data[firstErrorKey];
              if (Array.isArray(firstError)) {
                errorMessage = firstError[0];
              } else if (typeof firstError === 'string') {
                errorMessage = firstError;
              }
            }
            break;
            
          case 409:
            errorMessage = 'Пользователь с таким email уже существует';
            break;
            
          case 429:
            errorMessage = 'Слишком много попыток регистрации. Попробуйте позже.';
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
      
      // Фокусируемся на поле email при ошибке
      setTimeout(() => {
        if (error.response?.data?.email) {
          setFocus('email');
        } else {
          setFocus('full_name');
        }
      }, 100);
    } finally {
      setIsLoading(false);
    }
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-400';
    if (passwordStrength <= 3) return 'bg-yellow-400';
    return 'bg-green-400';
  };

  const getPasswordStrengthText = () => {
    if (password.length === 0) return '';
    if (passwordStrength <= 2) return 'Слабый пароль';
    if (passwordStrength <= 3) return 'Средний пароль';
    return 'Надежный пароль';
  };

  // Рендерим null если модалка закрыта
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="register-modal-title"
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
          aria-label="Закрыть окно регистрации"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2.5">
            <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {/* Контент */}
        <div className="flex flex-col items-center pt-16 pb-16 md:pt-20 lg:pt-24 px-6 sm:px-12 md:px-16 overflow-y-auto max-h-[85vh]">
          <h2 
            id="register-modal-title"
            className="text-3xl sm:text-4xl md:text-[42px] font-bold text-center text-black mb-4"
          >
            Регистрация
          </h2>

          <p className="text-center text-gray-500 text-base md:text-lg mb-10 leading-relaxed max-w-[400px]">
            заполните все поля для создания аккаунта
          </p>

          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="w-full max-w-[328px] space-y-5"
            noValidate
          >
            {/* ФИО */}
            <div>
              <input
                type="text"
                placeholder="ФИО"
                className={`
                  w-full h-[56px] px-6
                  bg-white border rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-orange-400/50
                  transition-all
                  ${errors.full_name 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:border-orange-400'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                {...register('full_name')}
                disabled={isLoading}
                aria-invalid={errors.full_name ? "true" : "false"}
                aria-describedby={errors.full_name ? "full_name-error" : undefined}
              />
              {errors.full_name && (
                <p id="full_name-error" className="text-red-500 text-sm mt-2">
                  {errors.full_name.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`
                  w-full h-[56px] px-6
                  bg-white border rounded-xl
                  text-base text-gray-800 placeholder:text-gray-400
                  focus:outline-none focus:ring-2 focus:ring-orange-400/50
                  transition-all
                  ${errors.email 
                    ? 'border-red-400 focus:border-red-400' 
                    : 'border-gray-300 focus:border-orange-400'
                  }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                {...register('email')}
                disabled={isLoading}
                aria-invalid={errors.email ? "true" : "false"}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <p id="email-error" className="text-red-500 text-sm mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Пароль */}
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
              
              {/* Индикатор силы пароля */}
              {password.length > 0 && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-500">
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                  <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                      style={{ width: `${Math.min(passwordStrength * 20, 100)}%` }}
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-400">
                    Рекомендуется: 8+ символов, заглавные и строчные буквы, цифры
                  </div>
                </div>
              )}
              
              {errors.password && (
                <p id="password-error" className="text-red-500 text-sm mt-2">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Повтор пароля */}
            <div>
              <div className="relative">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Повтор пароля"
                  className={`
                    w-full h-[56px] pl-6 pr-14
                    bg-white border rounded-xl
                    text-base text-gray-800 placeholder:text-gray-400
                    focus:outline-none focus:ring-2 focus:ring-orange-400/50
                    transition-all
                    ${errors.password2 
                      ? 'border-red-400 focus:border-red-400' 
                      : 'border-gray-300 focus:border-orange-400'
                    }
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                  {...register('password2')}
                  disabled={isLoading}
                  aria-invalid={errors.password2 ? "true" : "false"}
                  aria-describedby={errors.password2 ? "password2-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  disabled={isLoading}
                  aria-label={showConfirmPassword ? "Скрыть подтверждение пароля" : "Показать подтверждение пароля"}
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
                <p id="password2-error" className="text-red-500 text-sm mt-2">
                  {errors.password2.message}
                </p>
              )}
            </div>

            {/* Согласие с условиями */}
            <div className="flex items-start mt-4">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 mr-2 h-4 w-4 text-orange-500 focus:ring-orange-400 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                Я соглашаюсь с{' '}
                <a href="/terms" className="text-orange-500 hover:underline">
                  условиями использования
                </a>{' '}
                и{' '}
                <a href="/privacy" className="text-orange-500 hover:underline">
                  политикой конфиденциальности
                </a>
              </label>
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
                    Регистрация...
                  </span>
                ) : 'Зарегистрироваться'}
              </button>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={onSwitchToLogin}
                  className="text-[#FCA311] text-sm font-medium hover:underline transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  Уже есть аккаунт? Войти
                </button>
              </div>
            </div>
          </form>

          {/* Дополнительная информация */}
          <div className="mt-8 text-center text-sm text-gray-400 max-w-[400px]">
            <p>Регистрируясь, вы подтверждаете, что ознакомились с правилами сервиса</p>
          </div>
        </div>
      </div>
    </div>
  );
}
// src/features/auth/components/RegisterModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/features/auth/AuthProvider';

const registerSchema = z
  .object({
    full_name: z.string().min(2, 'Введите ФИО (минимум 2 символа)'),
    email: z.string().email('Некорректный email'),
    phone: z.string().optional(),
    password: z.string().min(6, 'Пароль минимум 6 символов'),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: 'Пароли не совпадают',
    path: ['password2'],
  });

export const RegisterModal = ({
  isOpen,
  onClose,
  onSwitchToLogin,
  onSuccessfulRegistration,
}) => {
  const { register: registerUser, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
      password: '',
      password2: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setFocus('full_name'), 100);
      document.body.style.overflow = 'hidden';
    } else {
      reset();
      document.body.style.overflow = '';
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, reset, setFocus, onClose]);

  const onSubmit = async (data) => {
    try {
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        password2: data.password2,
        // phone: data.phone || undefined, // если телефон обязательный — убери optional
      });

      if (typeof onSuccessfulRegistration === 'function') {
        onSuccessfulRegistration();
      }

      onClose();
    } catch (err) {
      // ошибки уже показываются через toast в useAuth
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-[668px] h-[859px] rounded-[30px] bg-white/80 backdrop-blur-[25px]"
        style={{ boxShadow: '0px 4px 20px 0 rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Крестик закрытия */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-[15px] top-[15px] w-[59px] h-[59px] flex items-center justify-center"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M1 1L10 10M19 19L10 10M10 10L19 1M10 10L1 19"
              stroke="#BFBFBF"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Заголовок */}
        <p className="absolute left-[164px] top-[123px] text-5xl font-bold text-center text-black">
          Регистрация
        </p>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ФИО */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[238px] gap-[3px]"
            style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
          >
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[328px] h-14 gap-3 p-4 rounded-lg bg-white">
              <input
                type="text"
                placeholder="ФИО"
                {...register('full_name')}
                disabled={isLoading}
                className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60"
              />
            </div>
            {errors.full_name && (
              <p className="text-red-500 text-sm mt-1">{errors.full_name.message}</p>
            )}
          </div>

          {/* Email */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[319px] gap-[3px]"
            style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
              <input
                type="email"
                placeholder="Email"
                {...register('email')}
                disabled={isLoading}
                className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60"
              />
            </div>
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          {/* Телефон (опционально) */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[393px] gap-[3px]"
            style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
              <input
                type="tel"
                placeholder="Телефон"
                {...register('phone')}
                disabled={isLoading}
                className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60"
              />
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
            )}
          </div>

          {/* Пароль */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[474px] gap-[3px]"
            style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 relative gap-3 p-4 rounded-lg bg-white">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Пароль"
                {...register('password')}
                disabled={isLoading}
                className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.916687 11C0.916687 11 4.58335 3.66669 11 3.66669C17.4167 3.66669 21.0834 11 21.0834 11C21.0834 11 17.4167 18.3334 11 18.3334C4.58335 18.3334 0.916687 11 0.916687 11Z"
                    stroke="#5E5E5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48124 12.5188 8.25002 11 8.25002C9.48124 8.25002 8.25002 9.48124 8.25002 11C8.25002 12.5188 9.48124 13.75 11 13.75Z"
                    stroke="#5E5E5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Повтор пароля */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[548px] gap-[3px]"
            style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
          >
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 relative gap-3 p-4 rounded-lg bg-white">
              <input
                type={showPassword2 ? 'text' : 'password'}
                placeholder="Повтор пароля"
                {...register('password2')}
                disabled={isLoading}
                className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60"
              />
              <button
                type="button"
                onClick={() => setShowPassword2(!showPassword2)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.916687 11C0.916687 11 4.58335 3.66669 11 3.66669C17.4167 3.66669 21.0834 11 21.0834 11C21.0834 11 17.4167 18.3334 11 18.3334C4.58335 18.3334 0.916687 11 0.916687 11Z"
                    stroke="#5E5E5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48124 12.5188 8.25002 11 8.25002C9.48124 8.25002 8.25002 9.48124 8.25002 11C8.25002 12.5188 9.48124 13.75 11 13.75Z"
                    stroke="#5E5E5E"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
            {errors.password2 && (
              <p className="text-red-500 text-sm mt-1">{errors.password2.message}</p>
            )}
          </div>

          {/* Кнопка "Зарегистрироваться" */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-[328px] absolute left-[165px] top-[660px] gap-4 px-6 py-4 rounded-2xl text-base font-black text-white"
            style={{
              background: 'linear-gradient(222.67deg, #fca311 -5.98%, #ef6c1a 117.77%)',
              boxShadow: '0px 0px 12px 0 #fca311',
            }}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          {/* Ссылка "Войти" */}
          <div className="absolute left-[165px] top-[734px] w-[328px]">
            <p className="text-sm text-left text-black">
              У вас уже есть аккаунт?
            </p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="text-sm text-[#ff9e00] hover:underline mt-1"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
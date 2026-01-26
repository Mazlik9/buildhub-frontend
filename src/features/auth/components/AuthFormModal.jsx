// src/features/auth/components/AuthFormModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { toast } from 'sonner';

// Схемы валидации
const loginSchema = z.object({
  login: z.string().min(1, 'Введите телефон или email'),
  password: z.string().min(1, 'Введите пароль'),
});

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

export const AuthFormModal = ({
  isOpen,
  onClose,
  mode = 'login', // 'login' | 'register'
  onSwitchMode,
  onSuccess,
}) => {
  const { login, register: registerUser, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const isLogin = mode === 'login';
  const formSchema = isLogin ? loginSchema : registerSchema;

  const defaultValues = isLogin
    ? { login: '', password: '' }
    : { full_name: '', email: '', phone: '', password: '', password2: '' };

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setFocus(isLogin ? 'login' : 'full_name'), 100);
      document.body.style.overflow = 'hidden';
    } else {
      reset();
      setFocusedField(null);
      document.body.style.overflow = '';
    }

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, reset, setFocus, onClose, isLogin]);

  const onSubmit = async (data) => {
    try {
      if (isLogin) {
        await login(data);
        toast.success('Вы успешно вошли');
      } else {
        await registerUser(data);
        toast.success('Регистрация успешна');
      }
      onClose();
      onSuccess?.();
    } catch (err) {
      // ошибки показываются через toast в useAuthContext
    }
  };

  if (!isOpen) return null;

  const renderInput = (name, placeholder, type = 'text', show = false) => (
    <div
      className="flex flex-col justify-start items-start w-full gap-[3px]"
      style={!errors[name] ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
    >
      <div
        className={`flex justify-start items-center h-14 p-4 rounded-lg ${
          errors[name]
            ? 'bg-[#d6d6d6] border-2 border-[#f00]'
            : focusedField === name
            ? 'bg-white border-2 border-[#fca311]'
            : 'bg-white border'
        }`}
      >
        <div className="flex flex-col justify-start items-start flex-grow relative mr-3">
          {errors[name] && (
            <p className="self-stretch text-xs text-left text-[#f00] mb-1">
              {errors[name]?.message}
            </p>
          )}
          <div className="flex justify-start items-center w-full relative">
            <input
              type={show ? 'text' : type}
              placeholder={placeholder}
              {...registerField(name)}
              disabled={isLoading}
              onFocus={() => setFocusedField(name)}
              onBlur={() => setFocusedField(null)}
              className={`flex-grow bg-transparent outline-none text-base text-left w-full ${
                errors[name] ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'
              }`}
            />
            {focusedField === name && !errors[name] && (
              <svg
                width={1}
                height={19}
                viewBox="0 0 1 19"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 ml-2"
                preserveAspectRatio="none"
              >
                <path d="M0.5 0.5V18.5" stroke="#FCA311" strokeLinecap="round" />
              </svg>
            )}
          </div>
        </div>
        {(name === 'password' || name === 'password2') && (
          <button
            type="button"
            onClick={() => (name === 'password' ? setShowPassword(!showPassword) : setShowPassword2(!showPassword2))}
            className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px]"
          >
            <svg
              width={22}
              height={22}
              viewBox="0 0 22 22"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              preserveAspectRatio="none"
            >
              <g clipPath="url(#clip0)">
                <g clipPath="url(#clip1)">
                  <path
                    d="M0.916687 11C0.916687 11 4.58335 3.66669 11 3.66669C17.4167 3.66669 21.0834 11 21.0834 11C21.0834 11 17.4167 18.3334 11 18.3334C4.58335 18.3334 0.916687 11 0.916687 11Z"
                    stroke="#5E5E5E"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M11 13.75C12.5188 13.75 13.75 12.5188 13.75 11C13.75 9.48124 12.5188 8.25002 11 8.25002C9.48124 8.25002 8.25002 9.48124 8.25002 11C8.25002 12.5188 9.48124 13.75 11 13.75Z"
                    stroke="#5E5E5E"
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </g>
              </g>
              <defs>
                <clipPath id="clip0">
                  <rect width={22} height={22} fill="white" />
                </clipPath>
                <clipPath id="clip1">
                  <rect width={22} height={22} fill="white" />
                </clipPath>
              </defs>
            </svg>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
    >
      <div
        className="relative w-[668px] h-[859px] rounded-[30px] bg-white/80 backdrop-blur-[25px]"
        style={{ boxShadow: '0px 4px 20px rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Крестик */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute left-[596px] top-[15px] w-[59px] h-[59px] flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300"
        >
          ✕
        </button>

        {/* Заголовок */}
        <p className="absolute left-[164px] top-[150px] text-5xl font-bold text-center text-black">
          {isLogin ? 'Авторизация' : 'Регистрация'}
        </p>

        {/* Форма */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="absolute left-[165px] top-[238px] w-[328px] flex flex-col gap-4"
        >
          {!isLogin && renderInput('full_name', 'ФИО')}
          {!isLogin && renderInput('email', 'Email', 'email')}
          {!isLogin && renderInput('phone', 'Телефон (опционально)', 'tel')}
          {isLogin && renderInput('login', 'Телефон или email')}
          {renderInput('password', 'Пароль', 'password', showPassword)}
          {!isLogin && renderInput('password2', 'Повтор пароля', 'password', showPassword2)}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-4 rounded-2xl bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-black shadow-lg hover:opacity-90 transition"
          >
            {isLogin ? (isLoading ? 'Вход...' : 'Войти') : isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>

          <p className="mt-2 text-sm text-center">
            {isLogin ? 'Нет аккаунта?' : 'Уже есть аккаунт?'}{' '}
            <button
              type="button"
              onClick={onSwitchMode}
              disabled={isLoading}
              className="text-[#ff9e00] font-semibold underline"
            >
              {isLogin ? 'Зарегистрироваться' : 'Войти'}
            </button>
          </p>
        </form>
      </div>
    </div>
  );
};

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

  const renderInput = (name, placeholder, type = 'text', show = false, topPosition) => (
    <div
      className={`flex flex-col justify-start items-start w-[328px] gap-[3px] absolute ${
        isLogin 
          ? name === 'login' ? 'left-[170px] top-[370px]' : 'left-[170px] top-[446px]'
          : name === 'full_name' ? 'left-[165px] top-[238px]' :
            name === 'email' ? 'left-[165px] top-[319px]' :
            name === 'phone' ? 'left-[165px] top-[393px]' :
            name === 'password' ? 'left-[165px] top-[474px]' : 'left-[165px] top-[548px]'
      }`}
      style={!errors[name] ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
    >
      <div
        className={`flex justify-start items-center self-stretch h-14 ${
          errors[name] ? 'bg-[#d6d6d6]' : 'bg-white'
        } rounded-lg p-4 ${name === 'password' || name === 'password2' ? 'relative' : ''}`}
      >
        <div className="flex flex-col justify-start items-start flex-grow">
          {errors[name] ? (
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
              <p className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848]">
                {errors[name]?.message}
              </p>
            </div>
          ) : (
            <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
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
            </div>
          )}
        </div>
        {(name === 'password' || name === 'password2') && (
          <button
            type="button"
            onClick={() => (name === 'password' ? setShowPassword(!showPassword) : setShowPassword2(!showPassword2))}
            className="flex-grow-0 flex-shrink-0 w-[22px] h-[22px] relative"
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
        {/* Крестик закрытия - УЛУЧШЕННЫЙ ДИЗАЙН */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-6 top-6 w-12 h-12 rounded-full bg-white/90 hover:bg-white transition-all duration-200 flex items-center justify-center cursor-pointer shadow-lg hover:shadow-xl active:scale-95 border border-gray-200/50"
          aria-label="Закрыть окно"
        >
          <svg
            width={24}
            height={24}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="text-gray-700 hover:text-gray-900 transition-colors"
          >
            <path
              d="M18 6L6 18M6 6L18 18"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {/* Заголовок */}
        <p className={`absolute text-5xl font-bold text-center text-black ${
          isLogin ? 'left-[161px] top-[159px]' : 'left-[164px] top-[123px]'
        }`}>
          {isLogin ? 'Авторизация' : 'Регистрация'}
        </p>

        {/* Дополнительный текст для авторизации */}
        {isLogin && (
          <>
            <p className="absolute left-48 top-[272px] text-lg text-center text-[#818181]">
              <span className="text-lg text-center text-[#818181]">для входа необходимо ввести</span>
              <br />
              <span className="text-lg text-center text-[#818181]">номер телефона и пароль</span>
            </p>
            <p className="absolute left-[170px] top-[522px] text-sm text-center text-[#818181]">
              Забыли пароль?
            </p>
          </>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Поля ввода */}
          {!isLogin && renderInput('full_name', 'ФИО', 'text')}
          {!isLogin && renderInput('email', 'Email', 'email')}
          {!isLogin && renderInput('phone', 'Телефон (опционально)', 'tel')}
          {isLogin && renderInput('login', 'Телефон или email')}
          {renderInput('password', 'Пароль', 'password', showPassword)}
          {!isLogin && renderInput('password2', 'Повтор пароля', 'password', showPassword2)}

          {/* Кнопка отправки формы */}
          <button
            type="submit"
            disabled={isLoading}
            className={`absolute w-[328px] h-14 gap-4 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition ${
              isLogin 
                ? 'left-[170px] top-[564px]' 
                : 'left-[165px] top-[660px]'
            }`}
            style={isLogin 
              ? { background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)" }
              : { 
                  background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)",
                  boxShadow: "0px 0px 12px 0 #fca311"
                }
            }
          >
            <p className="flex-grow-0 flex-shrink-0 text-base font-black text-center text-white">
              {isLogin 
                ? (isLoading ? 'Вход...' : 'Войти')
                : (isLoading ? 'Регистрация...' : 'Зарегистрироваться')
              }
            </p>
          </button>
        </form>

        {/* Кнопка переключения между режимами */}
        {isLogin ? (
          // Кнопка "Зарегистрироваться" в режиме логина
          <button
            type="button"
            onClick={onSwitchMode}
            disabled={isLoading}
            className="absolute w-[328px] left-[170px] top-[645px] flex justify-center items-center h-14 gap-4 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition border-2 border-[#fca311]"
          >
            <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-center text-[#ff9e00]">
              Зарегистрироваться
            </p>
          </button>
        ) : (
          // Текст и кнопка "Войти" в режиме регистрации (прижаты друг к другу)
          <div className="absolute left-1/2 transform -translate-x-1/2 top-[734px] flex items-center justify-center gap-1">
            <p className="text-sm text-black">У вас уже есть аккаунт?</p>
            <button
              type="button"
              onClick={onSwitchMode}
              disabled={isLoading}
              className="text-sm text-[#ff9e00] font-semibold hover:underline ml-1 cursor-pointer"
            >
              Войти
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
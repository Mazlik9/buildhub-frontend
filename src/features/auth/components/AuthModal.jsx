// src/features/auth/components/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuthContext } from '@/features/auth/AuthProvider';

const loginSchema = z.object({
  login: z.string().min(1, 'Введите телефон или email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const AuthModal = ({
  isOpen,
  onClose,
  onSwitchToRegister,
  onSuccessfulLogin,
}) => {
  const { login, isLoading } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setFocus,
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setFocus('login'), 100);
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
  }, [isOpen, reset, setFocus, onClose]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      if (typeof onSuccessfulLogin === 'function') {
        onSuccessfulLogin();
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
      {/* Крестик закрытия с круглым фоном - исправленная версия */}
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute left-[596px] top-[15px] w-[59px] h-[59px]"
        >
          <svg
            width={59}
            height={59}
            viewBox="0 0 59 59"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
          >
            <g filter="url(#filter0_d_2384_175)">
              <circle cx="29.5" cy="29.5" r="25.5" fill="#E4E4E4" />
            </g>
            <g filter="url(#filter0_i_2384_176)">
              <path
                d="M19 19L40 40M40 19L19 40"
                stroke="#BFBFBF"
                strokeWidth={2}
                strokeLinecap="round"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_2384_175"
                x={0}
                y={0}
                width={59}
                height={59}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2384_175" />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_2384_175"
                  result="shape"
                />
              </filter>
              <filter
                id="filter0_i_2384_176"
                x={17}
                y={17}
                width={25}
                height={25}
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity={0} result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset />
                <feGaussianBlur stdDeviation={2} />
                <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
                <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2384_176" />
              </filter>
            </defs>
          </svg>
        </button>

        {/* Заголовок */}
        <p className="absolute left-[161px] top-[159px] text-5xl font-bold text-center text-black">
          Авторизация
        </p>

        {/* Подзаголовок */}
        <p className="absolute left-48 top-[272px] text-lg text-center text-[#818181]">
          <span className="text-lg text-center text-[#818181]">для входа необходимо ввести</span>
          <br />
          <span className="text-lg text-center text-[#818181]">номер телефона и пароль</span>
        </p>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* Поле телефон/email */}
          <div
            className="flex flex-col justify-start items-start w-[328px] absolute left-[170px] top-[370px] gap-[3px]"
            style={!errors.login ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg ${errors.login ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'login' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative">
                {errors.login && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-[296px] text-xs text-left text-[#f00] mb-1">
                    Телефон или email
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type="text"
                    placeholder="Телефон или email"
                    {...register('login')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('login')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.login ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'login' && !errors.login && (
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
            </div>
          </div>

          {/* Поле пароль */}
          <div
            className="flex flex-col justify-start items-start w-[328px] absolute left-[170px] top-[446px] gap-[3px]"
            style={!errors.password ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 p-4 rounded-lg ${errors.password ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'password' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative mr-3">
                {errors.password && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-full text-xs text-left text-[#f00] mb-1">
                    Пароль
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Пароль"
                    {...register('password')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('password')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.password ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'password' && !errors.password && (
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
                  <g clipPath="url(#clip0_2750_117)">
                    <g clipPath="url(#clip1_2750_117)">
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
                    <clipPath id="clip0_2750_117">
                      <rect width={22} height={22} fill="white" />
                    </clipPath>
                    <clipPath id="clip1_2750_117">
                      <rect width={22} height={22} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          {/* Кнопка "Войти" */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-[328px] absolute left-[170px] top-[564px] gap-4 px-6 py-4 rounded-2xl"
            style={{
              background: 'linear-gradient(222.67deg, #fca311 -5.98%, #ef6c1a 117.77%)',
              boxShadow: '0px 0px 12px 0 #ef6c1a',
            }}
          >
            <p className="text-base font-black text-white">
              {isLoading ? 'Вход...' : 'Войти'}
            </p>
          </button>

          {/* Кнопка "Зарегистрироваться" */}
          <button
            type="button"
            onClick={onSwitchToRegister}
            disabled={isLoading}
            className="flex justify-center items-center w-[328px] h-14 absolute left-[170px] top-[645px] gap-4 px-6 py-4 rounded-2xl border-2 border-[#fca311]"
          >
            <p className="text-sm font-semibold text-center text-[#ff9e00]">
              Зарегистрироваться
            </p>
          </button>

          {/* Забыли пароль? */}
          <p className="absolute left-[170px] top-[522px] text-sm text-center text-[#818181]">
            Забыли пароль?
          </p>
        </form>
      </div>
    </div>
  );
};
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
  const [focusedField, setFocusedField] = useState(null);

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
      await registerUser({
        full_name: data.full_name,
        email: data.email,
        password: data.password,
        password2: data.password2,
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
        {/* Крестик закрытия с круглым фоном */}
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
        <p className="absolute left-[164px] top-[123px] text-5xl font-bold text-center text-black">
          Регистрация
        </p>

        {/* Форма */}
        <form onSubmit={handleSubmit(onSubmit)}>
          {/* ФИО */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[238px] gap-[3px]"
            style={!errors.full_name ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center flex-grow-0 flex-shrink-0 w-[328px] h-14 gap-3 p-4 rounded-lg ${errors.full_name ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'full_name' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative">
                {errors.full_name && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-[296px] text-xs text-left text-[#f00] mb-1">
                    ФИО
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type="text"
                    placeholder="ФИО"
                    {...register('full_name')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('full_name')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.full_name ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'full_name' && !errors.full_name && (
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

          {/* Email */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[319px] gap-[3px]"
            style={!errors.email ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg ${errors.email ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'email' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative">
                {errors.email && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-[296px] text-xs text-left text-[#f00] mb-1">
                    Email
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type="email"
                    placeholder="Email"
                    {...register('email')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('email')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.email ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'email' && !errors.email && (
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

          {/* Телефон (опционально) */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[393px] gap-[3px]"
            style={!errors.phone ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg ${errors.phone ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'phone' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative">
                {errors.phone && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-[296px] text-xs text-left text-[#f00] mb-1">
                    Телефон
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type="tel"
                    placeholder="Телефон"
                    {...register('phone')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('phone')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.phone ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'phone' && !errors.phone && (
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

          {/* Пароль */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[474px] gap-[3px]"
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

          {/* Повтор пароля */}
          <div
            className="flex flex-col justify-center items-center w-[328px] absolute left-[165px] top-[548px] gap-[3px]"
            style={!errors.password2 ? { filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' } : {}}
          >
            <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 p-4 rounded-lg ${errors.password2 ? 'bg-[#d6d6d6] border-2 border-[#f00]' : focusedField === 'password2' ? 'bg-white border-2 border-[#fca311]' : 'bg-white'}`}>
              <div className="flex flex-col justify-start items-start flex-grow relative mr-3">
                {errors.password2 && (
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-full text-xs text-left text-[#f00] mb-1">
                    Повтор пароля
                  </p>
                )}
                <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                  <input
                    type={showPassword2 ? 'text' : 'password'}
                    placeholder="Повтор пароля"
                    {...register('password2')}
                    disabled={isLoading}
                    onFocus={() => setFocusedField('password2')}
                    onBlur={() => setFocusedField(null)}
                    className={`flex-grow bg-transparent outline-none text-base text-left w-full ${errors.password2 ? 'text-black' : 'text-[#484848] placeholder:text-[#484848]/60'}`}
                  />
                  {focusedField === 'password2' && !errors.password2 && (
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
                onClick={() => setShowPassword2(!showPassword2)}
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
                  <g clipPath="url(#clip0_2785_66)">
                    <g clipPath="url(#clip1_2785_66)">
                      <path
                        d="M0.916687 11C0.916687 11 4.58335 3.66663 11 3.66663C17.4167 3.66663 21.0834 11 21.0834 11C21.0834 11 17.4167 18.3333 11 18.3333C4.58335 18.3333 0.916687 11 0.916687 11Z"
                        stroke="#5E5E5E"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M11 13.75C12.5188 13.75 13.75 12.5187 13.75 11C13.75 9.48118 12.5188 8.24996 11 8.24996C9.48124 8.24996 8.25002 9.48118 8.25002 11C8.25002 12.5187 9.48124 13.75 11 13.75Z"
                        stroke="#5E5E5E"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </g>
                  </g>
                  <defs>
                    <clipPath id="clip0_2785_66">
                      <rect width={22} height={22} fill="white" />
                    </clipPath>
                    <clipPath id="clip1_2785_66">
                      <rect width={22} height={22} fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </div>
          </div>

          {/* Кнопка "Зарегистрироваться" */}
          <button
            type="submit"
            disabled={isLoading}
            className="flex justify-center items-center w-[328px] absolute left-[165px] top-[660px] gap-4 px-6 py-4 rounded-2xl"
            style={{
              background: 'linear-gradient(222.67deg, #fca311 -5.98%, #ef6c1a 117.77%)',
              boxShadow: '0px 0px 12px 0 #fca311',
            }}
          >
            <p className="text-base font-black text-white">
              {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
            </p>
          </button>

          {/* Текст и кнопка "Войти" - по центру */}
          <div className="absolute left-[165px] top-[734px] w-[328px] flex justify-center items-center gap-2">
            <p className="text-sm text-black">У вас уже есть аккаунт?</p>
            <button
              type="button"
              onClick={onSwitchToLogin}
              disabled={isLoading}
              className="text-sm text-[#ff9e00] hover:underline"
            >
              Войти
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
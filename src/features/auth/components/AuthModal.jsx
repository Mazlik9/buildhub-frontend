// src/features/auth/components/AuthModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';

const loginSchema = z.object({
  login: z.string().min(1, 'Введите логин или email'),
  password: z.string().min(1, 'Введите пароль'),
});

export const AuthModal = ({ isOpen, onClose, onSwitchToRegister }) => {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();

  const { register, handleSubmit, formState: { errors }, reset, setFocus } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { login: '', password: '' },
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) setTimeout(() => setFocus('login'), 100);
    if (!isOpen) reset();
  }, [isOpen, reset, setFocus]);

  const onSubmit = async (data) => {
    try {
      await login(data);
      reset();
      onClose();
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-[92%] sm:w-[85%] md:w-[668px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 overflow-y-auto max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          disabled={isLoading}
          className="absolute right-5 top-5 w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center"
        >
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-4">Авторизация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Телефон или email"
            {...register('login')}
            className={`w-full px-4 h-14 border rounded-xl ${errors.login ? 'border-red-400' : 'border-gray-300'}`}
            disabled={isLoading}
          />
          {errors.login && <p className="text-red-500 text-sm">{errors.login.message}</p>}

          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Пароль"
              {...register('password')}
              className={`w-full px-4 h-14 border rounded-xl ${errors.password ? 'border-red-400' : 'border-gray-300'}`}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
            >
              {showPassword ? '👁️' : '🙈'}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 bg-[#FCA311] text-white font-bold rounded-xl disabled:opacity-50"
          >
            {isLoading ? 'Вход...' : 'Войти'}
          </button>
        </form>

        <button
          onClick={onSwitchToRegister}
          disabled={isLoading}
          className="w-full mt-4 text-[#FCA311] font-medium hover:underline"
        >
          Зарегистрироваться
        </button>
      </div>
    </div>
  );
};

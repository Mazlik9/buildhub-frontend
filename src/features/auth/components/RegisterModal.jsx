// src/features/auth/components/RegisterModal.jsx
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const registerSchema = z.object({
  full_name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  password2: z.string(),
}).refine(data => data.password === data.password2, { path: ['password2'], message: 'Пароли не совпадают' });

export const RegisterModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, formState: { errors }, reset, setFocus } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: { full_name: '', email: '', password: '', password2: '' },
  });

  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    if (isOpen) setTimeout(() => setFocus('full_name'), 100);
    if (!isOpen) reset();
  }, [isOpen, reset, setFocus]);

  const onSubmit = async (data) => {
    try {
      await registerUser(data);
      reset();
      onClose();
      setTimeout(() => navigate('/profile'), 500);
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
        <button onClick={onClose} disabled={isLoading} className="absolute right-5 top-5 w-10 h-10 rounded-full bg-gray-100">
          ✕
        </button>

        <h2 className="text-3xl font-bold text-center mb-4">Регистрация</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input type="text" placeholder="ФИО" {...register('full_name')} className="w-full px-4 h-14 border rounded-xl" />
          {errors.full_name && <p className="text-red-500 text-sm">{errors.full_name.message}</p>}

          <input type="email" placeholder="Email" {...register('email')} className="w-full px-4 h-14 border rounded-xl" />
          {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}

          <div className="relative">
            <input type={showPassword ? 'text' : 'password'} placeholder="Пароль" {...register('password')} className="w-full px-4 h-14 border rounded-xl" />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">👁️</button>
          </div>
          {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}

          <div className="relative">
            <input type={showConfirmPassword ? 'text' : 'password'} placeholder="Повтор пароля" {...register('password2')} className="w-full px-4 h-14 border rounded-xl" />
            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">👁️</button>
          </div>
          {errors.password2 && <p className="text-red-500 text-sm">{errors.password2.message}</p>}

          <button type="submit" disabled={isLoading} className="w-full h-14 bg-[#FCA311] text-white font-bold rounded-xl">
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </button>
        </form>

        <button onClick={onSwitchToLogin} disabled={isLoading} className="w-full mt-4 text-[#FCA311] font-medium hover:underline">
          Уже есть аккаунт? Войти
        </button>
      </div>
    </div>
  );
};

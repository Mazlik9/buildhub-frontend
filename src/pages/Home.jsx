// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/ui/AuthModal';
import RegisterModal from '../components/ui/RegisterModal'; // ← добавь импорт

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col">
      {/* Header */}
      <header className="bg-[#e8e3d9] border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Логотип слева */}
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🏗️</span>
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                СтройХаб
              </span>
            </Link>

            {/* Кнопка Войти справа */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="
                px-6 py-2.5 rounded-full
                bg-gray-900 text-white
                font-medium
                hover:bg-gray-800
                transition-colors
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
                text-sm sm:text-base
              "
            >
              Войти
            </button>
          </div>
        </div>
      </header>

      {/* Пустое основное пространство */}
      <main className="flex-1" />

      {/* Модалка авторизации */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        // Переключение на регистрацию
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);      // закрываем авторизацию
          setIsRegisterModalOpen(true);   // открываем регистрацию
        }}
      />

      {/* Модалка регистрации */}
      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        // Опционально: переключение обратно на авторизацию
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
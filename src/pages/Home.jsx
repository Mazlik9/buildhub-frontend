// src/pages/Home.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from '../components/ui/AuthModal';
import RegisterModal from '../components/ui/RegisterModal';

export default function Home() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col">
      {/* Header — адаптивный */}
      <header className="bg-[#e8e3d9] border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16">
            {/* Логотип — уменьшаем на мобильных */}
            <Link to="/" className="flex items-center gap-2 sm:gap-3">
              <span className="text-2xl sm:text-3xl">🏗️</span>
              <span className="text-xl sm:text-2xl font-bold text-gray-800 tracking-tight">
                СтройХаб
              </span>
            </Link>

            {/* Кнопка Войти — адаптивные размеры */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="
                px-4 py-2 text-sm sm:px-6 sm:py-2.5 sm:text-base
                rounded-full 
                bg-gray-900 text-white 
                font-medium 
                hover:bg-gray-800 
                transition-colors 
                focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
              "
            >
              Войти
            </button>
          </div>
        </div>
      </header>

      {/* Главный контент — пока пустой, но уже адаптивный */}
      <main className="flex-1 flex items-center justify-center px-4 py-12 sm:py-16">
        {/* Пример заглушки — чтобы было видно, что страница живая */}
        <div className="text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            Добро пожаловать в СтройХаб
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            Платформа для поиска подрядчиков, поставщиков и тендеров в строительстве
          </p>
        </div>
      </main>

      {/* Модалки — уже адаптивные внутри компонентов */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSwitchToRegister={() => {
          setIsAuthModalOpen(false);
          setIsRegisterModalOpen(true);
        }}
      />

      <RegisterModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        onSwitchToLogin={() => {
          setIsRegisterModalOpen(false);
          setIsAuthModalOpen(true);
        }}
      />
    </div>
  );
}
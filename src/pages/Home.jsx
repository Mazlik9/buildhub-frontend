// src/pages/Home.jsx
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#f5f0e6] flex flex-col"> {/* бежевый фон страницы */}
      
      {/* Header */}
      <header className="bg-[#e8e3d9] border-b border-gray-300 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Логотип слева */}
            <Link to="/" className="flex items-center gap-3">
              <span className="text-3xl">🏗️</span> {/* эмодзи башенного крана */}
              <span className="text-2xl font-bold text-gray-800 tracking-tight">
                СтройХаб
              </span>
            </Link>

            {/* Кнопка Войти справа */}
            <Link
              to="/login"
              className="px-6 py-2.5 rounded-full bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 text-sm sm:text-base"
            >
              Войти
            </Link>
          </div>
        </div>
      </header>

      {/* Пустое основное пространство */}
      <main className="flex-1" />

      {/* Можно оставить футер или убрать */}
      {/* <footer className="py-8 text-center text-gray-500 text-sm border-t border-gray-200 bg-[#e8e3d9]">
        © 2026 СтройХаб • Все права защищены
      </footer> */}
    </div>
  );
}
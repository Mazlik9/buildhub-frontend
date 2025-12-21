// src/pages/Main.jsx
import { Link } from "react-router-dom";
import { AuthModalButton } from "../components/AuthModalButton";
import { useTheme } from "../context/ThemeContext";

export function Main() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Хедер — светлее фона в светлой теме */}
      <header className="fixed top-0 left-0 right-0 bg-orange-50 dark:bg-gray-800 shadow-lg z-50">
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-6">
          {/* Логотип — левее */}
          <Link to="/main" className="flex items-center space-x-3 flex-shrink-0">
            <span className="text-4xl">🏗️</span>
            <span className="text-2xl md:text-3xl font-black text-orange-700 dark:text-orange-500">
              СтройХаб
            </span>
          </Link>

          {/* Поисковая строка — строго по центру */}
          <div className="flex-1 max-w-4xl">
            <div className="relative">
              <input
                type="text"
                placeholder="Искать на СтройХаб"
                className="w-full px-6 py-4 pl-14 pr-20 text-lg rounded-full border border-orange-200 dark:border-gray-600 bg-white dark:bg-gray-700 focus:outline-none focus:ring-4 focus:ring-orange-300 dark:focus:ring-orange-600 transition-shadow"
              />
              <svg
                className="absolute left-5 top-1/2 -translate-y-1/2 w-7 h-7 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <button className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-2 bg-orange-600 hover:bg-orange-700 text-white font-medium rounded-full transition">
                Найти
              </button>
            </div>
          </div>

          {/* Правый блок — кнопка темы + вход */}
          <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
            <button
              onClick={toggleTheme}
              className="p-3 rounded-full bg-gray-700 dark:bg-orange-200/50 hover:bg-orange-200 dark:hover:bg-gray-600 transition"
            >
              {isDark ? "☀️" : "🌙"}
            </button>

            <AuthModalButton />
          </div>
        </div>
      </header>

      {/* Отступ под фиксированный хедер */}
      <main className="pt-24 px-4 lg:px-8">
        {/* Здесь будет основной контент главной страницы */}
      </main>
    </div>
  );
}
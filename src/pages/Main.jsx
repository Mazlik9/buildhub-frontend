// src/pages/Main.jsx
import { Link } from "react-router-dom";
import { AuthModalButton } from "../components/AuthModalButton";
import { ThemeToggleButton } from "../components/ThemeToggleButton";  // ← Новый импорт
import { useUser } from "../context/UserContext";

export function Main() {
  const { user, logout } = useUser();

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <header className="fixed top-0 left-0 right-0 bg-orange-50 dark:bg-gray-800 shadow-lg z-50">
        <div className="px-4 lg:px-8 py-3 flex items-center justify-between gap-6">
          {/* Логотип */}
          <Link to="/" className="flex items-center space-x-3 flex-shrink-0">
            <span className="text-4xl">🏗️</span>
            <span className="text-2xl md:text-3xl font-black text-orange-700 dark:text-orange-500">
              СтройХаб
            </span>
          </Link>

          {/* Поиск */}
          {/* ... твой код поиска ... */}

          {/* Правый блок — кнопка темы + аватарка с именем + выход */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
          {/* Кнопка смены темы */}
          <ThemeToggleButton />
          
          {/* Если залогинен — аватарка + имя + выход */}
          {user ? (
            <div className="flex items-center space-x-3">
              {/* Аватарка — круглая с инициалом */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                {user.full_name?.charAt(0).toUpperCase() || "С"}
              </div>
          
              {/* Имя пользователя + кнопка выхода */}
              <div className="flex flex-col">
                <Link
                  to="/profile"
                  className="text-lg font-medium text-gray-900 dark:text-white hover:text-orange-600 dark:hover:text-orange-500 transition"
                >
                  {user.full_name || "Пользователь"}
                </Link>
                <button
                  onClick={logout}
                  className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition text-left"
                >
                  Выйти
                </button>
              </div>
            </div>
          ) : (
            /* Если не залогинен — кнопка входа */
            <AuthModalButton />
          )}
        </div>
        </div>
      </header>

      <main className="pt-24 px-4 lg:px-8">
        {/* Контент главной страницы */}
      </main>
    </div>
  );
}
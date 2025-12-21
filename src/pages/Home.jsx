// src/pages/Home.jsx
import { AuthModalButton } from "../components/AuthModalButton";
import { useTheme } from "../context/ThemeContext";

export function Home() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden transition-colors duration-500">
      {/* Кнопка смены темы — работает */}
      <button
        onClick={toggleTheme}
        className="fixed top-6 right-6 z-50 w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-lg flex items-center justify-center text-3xl hover:scale-110 transition-all duration-300"
        aria-label="Переключить тему"
      >
        {isDark ? "☀️" : "🌙"}
      </button>

      <main className="text-center max-w-4xl">
        <h1 className="text-6xl md:text-8xl font-black mb-8">
          СтройХаб
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-12">
          Маркетплейс строительных материалов и оборудования<br />
          Продажа и аренда по всей России
        </p>

        {/* Твоя модалка авторизации */}
        <AuthModalButton />

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="space-y-4">
            <div className="text-7xl">🔍</div>
            <h3 className="text-2xl font-bold">Быстрый поиск</h3>
            <p className="text-gray-600 dark:text-gray-400">Находите всё за секунды</p>
          </div>
          <div className="space-y-4">
            <div className="text-7xl">🤝</div>
            <h3 className="text-2xl font-bold">Прямые сделки</h3>
            <p className="text-gray-600 dark:text-gray-400">Без посредников</p>
          </div>
          <div className="space-y-4">
            <div className="text-7xl">🚛</div>
            <h3 className="text-2xl font-bold">По всей России</h3>
            <p className="text-gray-600 dark:text-gray-400">Доставка в любой регион</p>
          </div>
        </div>
      </main>

      <footer className="absolute bottom-8 text-gray-500 dark:text-gray-400 text-sm">
        © 2025 СтройХаб
      </footer>
    </div>
  );
}
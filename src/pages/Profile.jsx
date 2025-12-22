// src/pages/Profile.jsx
import { useUser } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { ThemeToggleButton } from "../components/ThemeToggleButton";

export function Profile() {
  const { user, logout } = useUser();
  const navigate = useNavigate();

  if (!user) {
    navigate("/");
    return null;
  }

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  // Пока рейтинг заглушка — 4.5 из 5 (можно потом брать с бэкенда)
  const rating = 4.5;

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      {/* Кнопки в углах */}
      <BackButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggleButton />
      </div>

      {/* Основной контент */}
      <div className="pt-24 px-4 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center">
            {/* Аватарка — большой круг */}
            <div className="mx-auto w-40 h-40 mb-6 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-6xl font-bold shadow-xl">
              {/* Заглушка — первая буква имени */}
              {user.full_name?.charAt(0).toUpperCase() || "С"}
            </div>

            {/* Полное имя */}
            <h2 className="text-3xl font-black mb-4">
              {user.full_name || "Пользователь"}
            </h2>

            {/* Рейтинг из 5 звёзд */}
            <div className="flex items-center justify-center mb-6 space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  className={`w-8 h-8 ${
                    star <= Math.floor(rating)
                      ? "text-yellow-400"
                      : star - rating <= 0.5
                      ? "text-yellow-400"
                      : "text-gray-300 dark:text-gray-600"
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-3 text-xl font-medium">{rating.toFixed(1)}</span>
            </div>

            {/* Email */}
            <div className="mb-10">
              <p className="text-lg text-gray-600 dark:text-gray-400">Email</p>
              <p className="text-xl font-semibold">{user.email}</p>
            </div>

            {/* Кнопка смены пароля */}
            <button className="w-full py-4 mb-6 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300">
              Сменить пароль
            </button>

            {/* Кнопка выхода */}
            <button
              onClick={handleLogout}
              className="w-full py-4 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition-all duration-300"
            >
              Выйти из аккаунта
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
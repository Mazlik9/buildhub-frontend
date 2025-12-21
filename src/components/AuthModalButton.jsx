// src/components/AuthModalButton.jsx
import { useState } from "react";

export function AuthModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login"); // "login" или "register"

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({ name: "", email: "", password: "" });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ name: "", email: "", password: "" });
    setLoading(false);
  };

  // Валидация и отправка входа
  const handleLogin = async () => {
    const newErrors = {};
    if (!loginForm.email.trim()) newErrors.email = "Email обязателен";
    else if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) newErrors.email = "Некорректный email";
    if (!loginForm.password) newErrors.password = "Пароль обязателен";

    setErrors({ type: "login", ...newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // Замени на реальный URL от твоего друга-бэкендера
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      });
      if (!response.ok) throw new Error("Неверный email или пароль");
      alert("Вход успешен!");
      closeModal();
    } catch (err) {
      alert(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  // Валидация и отправка регистрации
  const handleRegister = async () => {
    const newErrors = {};
    if (!registerForm.name.trim()) newErrors.name = "Имя обязательно";
    if (!registerForm.email.trim()) newErrors.email = "Email обязателен";
    else if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) newErrors.email = "Некорректный email";
    if (!registerForm.password) newErrors.password = "Пароль обязателен";
    else if (registerForm.password.length < 8) newErrors.password = "Минимум 8 символов";

    setErrors({ type: "register", ...newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      // Замени на реальный URL
      const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(registerForm),
      });
      if (!response.ok) throw new Error("Ошибка регистрации");
      alert("Регистрация успешна!");
      closeModal();
    } catch (err) {
      alert(err.message || "Ошибка регистрации");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Главная кнопка на домашней странице */}
      <button
        onClick={() => setIsOpen(true)}
        className="px-12 py-6 text-2xl font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
      >
        Войти / Зарегистрироваться
      </button>

      {/* Модальное окно */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок и крестик */}
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Аккаунт</h2>
              <button
                onClick={closeModal}
                className="text-4xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

            {/* Вкладки */}
            <div className="flex justify-center mb-8 border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setActiveTab("login")}
                className={`px-8 py-3 text-lg font-medium transition-colors ${
                  activeTab === "login"
                    ? "text-orange-600 border-b-4 border-orange-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Вход
              </button>
              <button
                onClick={() => setActiveTab("register")}
                className={`px-8 py-3 text-lg font-medium transition-colors ${
                  activeTab === "register"
                    ? "text-orange-600 border-b-4 border-orange-600"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                Регистрация
              </button>
            </div>

            {/* Формы */}
            <div className="space-y-6">
              {activeTab === "login" ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      placeholder="example@mail.com"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "login" && errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      placeholder="Ваш пароль"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "login" && errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <button
                    onClick={handleLogin}
                    disabled={loading}
                    className="w-full py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Вход..." : "Войти"}
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Имя
                    </label>
                    <input
                      value={registerForm.name}
                      onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      placeholder="Ваше имя"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "register" && errors.name && (
                      <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={registerForm.email}
                      onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                      placeholder="example@mail.com"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "register" && errors.email && (
                      <p className="mt-2 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Пароль
                    </label>
                    <input
                      type="password"
                      value={registerForm.password}
                      onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                      placeholder="Минимум 8 символов"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "register" && errors.password && (
                      <p className="mt-2 text-sm text-red-600">{errors.password}</p>
                    )}
                  </div>

                  <button
                    onClick={handleRegister}
                    disabled={loading}
                    className="w-full py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {loading ? "Регистрация..." : "Зарегистрироваться"}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
// src/components/AuthModalButton.jsx
import { useState } from "react";
import { useUser } from "../context/UserContext"; // Если есть UserContext, иначе удали эту строку и login()

export function AuthModalButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("login");

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [registerForm, setRegisterForm] = useState({
    full_name: "",
    email: "",
    password: "",
    password2: "",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login } = useUser(); // Если нет UserContext — удали эту строку и вызовы login()

  const closeModal = () => {
    setIsOpen(false);
    setErrors({});
    setLoginForm({ email: "", password: "" });
    setRegisterForm({ full_name: "", email: "", password: "", password2: "" });
    setLoading(false);
  };

  // Вход
  const handleLogin = async () => {
    const newErrors = {};
    if (!loginForm.email.trim()) newErrors.email = "Email обязателен";
    else if (!/^\S+@\S+\.\S+$/.test(loginForm.email)) newErrors.email = "Некорректный email";
    if (!loginForm.password) newErrors.password = "Пароль обязателен";

    setErrors({ type: "login", ...newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/login/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: loginForm.email,
          password: loginForm.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Неверный email или пароль");

      if (login) {
        login({ email: data.email }, data.access);
        localStorage.setItem("refresh", data.refresh);
      }

      alert("Вход успешен!");
      closeModal();
    } catch (err) {
      alert(err.message || "Ошибка входа");
    } finally {
      setLoading(false);
    }
  };

  // Регистрация
  const handleRegister = async () => {
    const newErrors = {};
    if (!registerForm.full_name.trim()) newErrors.full_name = "Имя обязательно";
    if (!registerForm.email.trim()) newErrors.email = "Email обязателен";
    else if (!/^\S+@\S+\.\S+$/.test(registerForm.email)) newErrors.email = "Некорректный email";
    if (!registerForm.password) newErrors.password = "Пароль обязателен";
    else if (registerForm.password.length < 8) newErrors.password = "Минимум 8 символов";
    if (!registerForm.password2) newErrors.password2 = "Подтвердите пароль";
    else if (registerForm.password !== registerForm.password2) newErrors.password2 = "Пароли не совпадают";

    setErrors({ type: "register", ...newErrors });
    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/api/v1/user/registration/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: registerForm.email,
          full_name: registerForm.full_name,
          password: registerForm.password,
          password2: registerForm.password2,
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.detail || "Ошибка регистрации");

      if (login) {
        login({ email: data.email, full_name: data.full_name }, data.access);
        localStorage.setItem("refresh", data.refresh);
      }

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
      <button
        onClick={() => setIsOpen(true)}
        className="px-12 py-6 text-2xl font-bold bg-orange-600 hover:bg-orange-700 text-white rounded-xl shadow-2xl transition-all duration-300 hover:scale-105"
      >
        Войти / Зарегистрироваться
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Аккаунт</h2>
              <button
                onClick={closeModal}
                className="text-4xl text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition"
              >
                ×
              </button>
            </div>

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
                      Полное имя
                    </label>
                    <input
                      value={registerForm.full_name}
                      onChange={(e) => setRegisterForm({ ...registerForm, full_name: e.target.value })}
                      placeholder="Иван Иванов"
                      autoFocus
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "register" && errors.full_name && (
                      <p className="mt-2 text-sm text-red-600">{errors.full_name}</p>
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

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Подтвердите пароль
                    </label>
                    <input
                      type="password"
                      value={registerForm.password2}
                      onChange={(e) => setRegisterForm({ ...registerForm, password2: e.target.value })}
                      placeholder="Повторите пароль"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                    />
                    {errors.type === "register" && errors.password2 && (
                      <p className="mt-2 text-sm text-red-600">{errors.password2}</p>
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
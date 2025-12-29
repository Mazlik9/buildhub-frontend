// src/pages/MyCompanies.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { apiFetch } from "../utils/api";

export function MyCompanies() {
  const [showCreateForm, setShowCreateForm] = useState(false); // Показ формы создания
  const [createdCompany, setCreatedCompany] = useState(null); // Информация о созданной компании
  const [loadingInfo, setLoadingInfo] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    inn: "",
    description: "",
    address: "",
    phone: "",
    email: "",
  });
  const [formErrors, setFormErrors] = useState({});
  const [creating, setCreating] = useState(false);

  const navigate = useNavigate();

  // Создание компании + получение информации
  const handleCreateCompany = async () => {
    setCreating(true);
    setFormErrors({});

    try {
      const response = await apiFetch("/api/v1/companies/", {
        method: "POST",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errData = await response.json();
        setFormErrors(errData);
        throw new Error("Ошибка создания компании");
      }

      const newCompany = await response.json();

      // Загружаем полную информацию по slug
      setLoadingInfo(true);
      const infoResponse = await apiFetch(`/api/v1/companies/${newCompany.slug}/`);
      if (!infoResponse.ok) throw new Error("Не удалось загрузить информацию");
      const infoData = await infoResponse.json();
      setCreatedCompany(infoData);
      setLoadingInfo(false);

      // Сбрасываем форму
      setFormData({ name: "", inn: "", description: "", address: "", phone: "", email: "" });
      setShowCreateForm(false);
      alert("Компания успешно создана!");
    } catch (err) {
      console.error(err);
      alert(err.message || "Ошибка при создании компании");
      setLoadingInfo(false);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <BackButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggleButton />
      </div>

      <div className="pt-24 px-4 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center">
            <h1 className="text-4xl font-black mb-12">Мои компании</h1>

            {/* Кнопка Создать компанию */}
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="w-full py-6 text-2xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300"
            >
              {showCreateForm ? "− Скрыть форму" : "+ Создать компанию"}
            </button>

            {/* Форма создания (показывается под кнопкой) */}
            {showCreateForm && (
              <div className="mt-10 space-y-6 text-left">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Название компании *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formErrors.name && <p className="mt-2 text-sm text-red-600">{formErrors.name.join(" ")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    ИНН *
                  </label>
                  <input
                    type="text"
                    value={formData.inn}
                    onChange={(e) => setFormData({ ...formData, inn: e.target.value })}
                    placeholder="10 или 12 цифр"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formErrors.inn && <p className="mt-2 text-sm text-red-600">{formErrors.inn.join(" ")}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Описание
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Адрес
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+7 (999) 999-99-99"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {formErrors.email && <p className="mt-2 text-sm text-red-600">{formErrors.email.join(" ")}</p>}
                </div>

                <div className="flex space-x-4 mt-8">
                  <button
                    onClick={handleCreateCompany}
                    disabled={creating}
                    className="flex-1 py-4 text-xl font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg transition-all disabled:opacity-70"
                  >
                    {creating ? "Создание..." : "Создать компанию"}
                  </button>
                  <button
                    onClick={() => setShowCreateForm(false)}
                    className="flex-1 py-4 text-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}

            {/* Информация о созданной компании (появляется под кнопкой) */}
            {loadingInfo && (
              <div className="mt-12 text-center">
                <p className="text-xl">Загрузка информации о компании...</p>
              </div>
            )}

            {createdCompany && (
              <div className="mt-12 bg-gray-50 dark:bg-gray-700 rounded-2xl p-8 shadow-lg">
                <h2 className="text-3xl font-black mb-6 text-center">Компания создана!</h2>

                <div className="flex items-center space-x-6 mb-8 justify-center">
                  {createdCompany.logo ? (
                    <img
                      src={createdCompany.logo}
                      alt={createdCompany.name}
                      className="w-32 h-32 rounded-full object-cover shadow-xl"
                    />
                  ) : (
                    <div className="w-32 h-32 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-5xl font-bold shadow-xl">
                      {createdCompany.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="text-left">
                    <h3 className="text-3xl font-bold">{createdCompany.name}</h3>
                    <p className="text-xl text-gray-600 dark:text-gray-400">ИНН: {createdCompany.inn}</p>
                    {createdCompany.is_verified && (
                      <p className="text-green-600 text-xl font-medium mt-2">✓ Верифицирована</p>
                    )}
                  </div>
                </div>

                <div className="space-y-4 text-left">
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Описание:</span> {createdCompany.description || "Не указано"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Адрес:</span> {createdCompany.address || "Не указан"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Телефон:</span> {createdCompany.phone || "Не указан"}
                  </p>
                  <p className="text-gray-700 dark:text-gray-300">
                    <span className="font-medium">Email:</span> {createdCompany.email || "Не указан"}
                  </p>
                </div>

                <div className="mt-8 text-center">
                  <button
                    onClick={() => setCreatedCompany(null)}
                    className="px-8 py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all"
                  >
                    Создать ещё одну компанию
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
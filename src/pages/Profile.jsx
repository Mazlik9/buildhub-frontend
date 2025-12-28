// src/pages/Profile.jsx
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BackButton } from "../components/BackButton";
import { ThemeToggleButton } from "../components/ThemeToggleButton";
import { apiFetch } from "../utils/api";
import { useUser } from "../context/UserContext";

export function Profile() {
  const { logout } = useUser();
  const [profile, setProfile] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generalError, setGeneralError] = useState(null);

  // Аватарка
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const fileInputRef = useRef(null);

  // Смена пароля
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    old_password: "",
    new_password: "",
    new_password2: "",
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordLoading, setPasswordLoading] = useState(false);

  const navigate = useNavigate();

  // Функция замены домена MinIO на localhost
  const getAvatarUrl = (url) => {
    if (!url) return null;
    return url.replace("minio:9000", "localhost:9000");
  };

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await apiFetch("/api/v1/user-self/");
        if (!response.ok) throw new Error("Не удалось загрузить профиль");
        const data = await response.json();
        setProfile(data);
        setEditedProfile(data);
        if (data.avatar) {
          setAvatarPreview(getAvatarUrl(data.avatar)); // ← Замена домена
        }
      } catch (err) {
        setGeneralError(err.message);
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [navigate]);

  // Загрузка аватарки PATCH /api/v1/user-self/avatar/
  const handleAvatarUpload = async (file) => {
    if (!file) return;

    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const response = await apiFetch("/api/v1/user-self/avatar/", {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || errData.avatar || "Ошибка загрузки аватарки");
      }

      const data = await response.json();
      setProfile((prev) => ({ ...prev, avatar: data.avatar }));
      setAvatarPreview(getAvatarUrl(data.avatar)); // ← Замена домена после загрузки
      alert("Аватарка успешно загружена!");
    } catch (err) {
      alert(err.message || "Не удалось загрузить аватарку");
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Файл слишком большой. Максимум 2MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result);
      reader.readAsDataURL(file);
      handleAvatarUpload(file);
    }
  };

  // Сохранение имени и телефона
  const handleSaveProfile = async () => {
    setSaving(true);
    setEditErrors({});
    setGeneralError(null);

    try {
      const response = await apiFetch("/api/v1/user-self/", {
        method: "PATCH",
        body: JSON.stringify({
          full_name: editedProfile.full_name?.trim() || null,
          phone: editedProfile.phone ? editedProfile.phone.replace(/\D/g, "") : null,
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        const errors = {};
        if (errData.full_name) errors.full_name = errData.full_name.join(" ");
        if (errData.phone) errors.phone = errData.phone.join(" ");
        if (errData.detail) setGeneralError(errData.detail);
        setEditErrors(errors);
        throw new Error("Ошибка валидации");
      }

      const updated = await response.json();
      setProfile(updated);
      setEditMode(false);
      alert("Профиль успешно обновлён!");
    } catch (err) {
      if (!generalError && Object.keys(editErrors).length === 0) {
        setGeneralError("Не удалось сохранить изменения");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedProfile(profile);
    setEditErrors({});
    setGeneralError(null);
    setEditMode(false);
  };

  // Смена пароля
  const handleChangePassword = async () => {
    const newErrors = {};
    if (!passwordForm.old_password) newErrors.old_password = "Введите текущий пароль";
    if (!passwordForm.new_password) newErrors.new_password = "Введите новый пароль";
    else if (passwordForm.new_password.length < 8) newErrors.new_password = "Минимум 8 символов";
    if (!passwordForm.new_password2) newErrors.new_password2 = "Подтвердите новый пароль";
    else if (passwordForm.new_password !== passwordForm.new_password2) newErrors.new_password2 = "Пароли не совпадают";

    setPasswordErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setPasswordLoading(true);
    try {
      const response = await apiFetch("/api/v1/user-self/change-password/", {
        method: "POST",
        body: JSON.stringify(passwordForm),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.detail || "Ошибка смены пароля");
      }

      alert("Пароль успешно изменён!");
      setIsPasswordModalOpen(false);
      setPasswordForm({ old_password: "", new_password: "", new_password2: "" });
      setPasswordErrors({});
    } catch (err) {
      alert(err.message);
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-2xl">Загрузка...</p></div>;
  if (generalError && !profile) return <div className="min-h-screen flex items-center justify-center"><p className="text-2xl text-red-600">{generalError}</p></div>;

  return (
    <div className="min-h-screen bg-orange-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <BackButton />
      <div className="fixed top-6 right-6 z-50">
        <ThemeToggleButton />
      </div>

      <div className="pt-24 px-4 lg:px-8 flex items-center justify-center min-h-screen">
        <div className="max-w-md w-full">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 text-center">
            {/* Аватарка */}
            <div
              className="mx-auto w-40 h-40 mb-6 rounded-full overflow-hidden shadow-xl cursor-pointer relative group"
              onClick={() => fileInputRef.current?.click()}
            >
              {uploadingAvatar ? (
                <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                  <p className="text-gray-600">Загрузка...</p>
                </div>
              ) : avatarPreview ? (
                <img src={avatarPreview} alt="Аватарка" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white text-6xl font-bold">
                  {profile.full_name?.charAt(0).toUpperCase() || "С"}
                </div>
              )}
              <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white text-lg font-medium">Изменить</span>
              </div>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleAvatarChange}
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
            />

            <h2 className="text-3xl font-black mb-8">Мой профиль</h2>

            {generalError && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 rounded-lg">
                <p className="text-red-700 dark:text-red-400 text-center">{generalError}</p>
              </div>
            )}

            {/* Полное имя */}
            <div className="mb-6 text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Полное имя</p>
              {editMode ? (
                <>
                  <input
                    type="text"
                    value={editedProfile.full_name || ""}
                    onChange={(e) => setEditedProfile({ ...editedProfile, full_name: e.target.value })}
                    className="w-full px-4 py-3 border border-orange-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {editErrors.full_name && <p className="mt-2 text-sm text-red-600">{editErrors.full_name}</p>}
                </>
              ) : (
                <p className="text-xl font-semibold">{profile.full_name || "Не указано"}</p>
              )}
            </div>

            {/* Телефон */}
            <div className="mb-6 text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Телефон</p>
              {editMode ? (
                <>
                  <input
                    type="tel"
                    value={editedProfile.phone || ""}
                    onChange={(e) => {
                      let value = e.target.value.replace(/\D/g, "");
                      if (value.startsWith("8")) value = "7" + value.slice(1);
                      if (value.length > 11) value = value.slice(0, 11);
                      let formatted = "";
                      if (value.length > 0) formatted = "+7";
                      if (value.length > 1) formatted += " (" + value.slice(1, 4);
                      if (value.length >= 5) formatted += ") " + value.slice(4, 7);
                      if (value.length >= 8) formatted += "-" + value.slice(7, 9);
                      if (value.length >= 10) formatted += "-" + value.slice(9, 11);
                      setEditedProfile({ ...editedProfile, phone: formatted });
                    }}
                    placeholder="+7 (999) 999-99-99"
                    className="w-full px-4 py-3 border border-orange-200 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                  {editErrors.phone && <p className="mt-2 text-sm text-red-600">{editErrors.phone}</p>}
                </>
              ) : (
                <p className="text-xl font-semibold">{profile.phone || "Не указан"}</p>
              )}
            </div>

            {/* Email */}
            <div className="mb-10 text-left">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">Email</p>
              <p className="text-xl font-semibold break-all">{profile.email}</p>
            </div>

            {/* Кнопки */}
            {editMode ? (
              <div className="space-y-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={saving}
                  className="w-full py-4 text-xl font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  {saving ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  onClick={handleCancelEdit}
                  className="w-full py-4 text-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
                >
                  Отмена
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                
                <button
                  onClick={() => navigate("/my-companies")}
                  className="w-full py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300"
                >
                  Мои компании
                </button>

                <button
                  onClick={() => setEditMode(true)}
                  className="w-full py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300"
                >
                  Редактировать профиль
                </button>

                <button
                  onClick={() => setIsPasswordModalOpen(true)}
                  className="w-full py-4 text-xl font-bold text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-lg transition-all duration-300"
                >
                  Сменить пароль
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full py-4 text-xl font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-lg transition-all duration-300"
                >
                  Выйти из аккаунта
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модалка смены пароля */}
      {isPasswordModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
          onClick={() => setIsPasswordModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Сменить пароль</h3>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Текущий пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.old_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, old_password: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {passwordErrors.old_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.old_password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                  placeholder="Минимум 8 символов"
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {passwordErrors.new_password && <p className="mt-2 text-sm text-red-600">{passwordErrors.new_password}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Подтвердите новый пароль
                </label>
                <input
                  type="password"
                  value={passwordForm.new_password2}
                  onChange={(e) => setPasswordForm({ ...passwordForm, new_password2: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
                {passwordErrors.new_password2 && <p className="mt-2 text-sm text-red-600">{passwordErrors.new_password2}</p>}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleChangePassword}
                  disabled={passwordLoading}
                  className="flex-1 py-4 text-xl font-bold text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-lg transition-all duration-300 disabled:opacity-70"
                >
                  {passwordLoading ? "Сохранение..." : "Сохранить"}
                </button>
                <button
                  onClick={() => {
                    setIsPasswordModalOpen(false);
                    setPasswordForm({ old_password: "", new_password: "", new_password2: "" });
                    setPasswordErrors({});
                  }}
                  className="flex-1 py-4 text-xl font-bold text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 rounded-lg transition-all"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
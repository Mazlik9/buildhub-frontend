// src/features/profile/components/ProfileEditForm.jsx
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { toast } from 'sonner';

export default function ProfileEditForm() {
  const { profile, loading, error, updateProfile } = useProfile();

  // Локальное состояние формы — инициализируется из profile
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: 'male',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  // Синхронизируем форму с данными из хука при первой загрузке или изменении profile
  useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        birth_date: profile.birth_date || '',
        gender: profile.gender || 'male',
      });
    }
  }, [profile]);

  // Проверяем, изменились ли данные
  useEffect(() => {
    if (!profile) return;

    const changed =
      formData.full_name !== (profile.full_name || '') ||
      formData.email !== (profile.email || '') ||
      formData.phone !== (profile.phone || '') ||
      formData.birth_date !== (profile.birth_date || '') ||
      formData.gender !== (profile.gender || 'male');

    setHasChanges(changed);
  }, [formData, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Изменения сохранены');
      setHasChanges(false);
    } catch (err) {
      // toast уже показывается внутри useProfile
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow p-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
        <div className="space-y-6">
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
          <div className="h-14 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow p-8 text-center text-red-600">
        {error}
        <button
          onClick={() => window.location.reload()}
          className="mt-4 px-6 py-3 bg-orange-500 text-white rounded-xl"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Редактирование профиля</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* ФИО */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ФИО</label>
          <input
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isSaving}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            placeholder="Иванов Иван Иванович"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSaving}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            placeholder="example@email.com"
          />
        </div>

        {/* Телефон */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Телефон</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            disabled={isSaving}
            className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            placeholder="+7 (___) ___-__-__"
          />
        </div>

        {/* Дата рождения + Пол */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Дата рождения</label>
            <input
              name="birth_date"
              type="date"
              value={formData.birth_date}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Пол</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isSaving}
              className="w-full px-5 py-4 border border-gray-300 rounded-2xl focus:ring-2 focus:ring-orange-400 focus:border-orange-400 outline-none transition bg-white"
            >
              <option value="male">Мужской</option>
              <option value="female">Женский</option>
              <option value="other">Другой</option>
            </select>
          </div>
        </div>

        {/* Кнопки действий */}
        <div className="pt-8 flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={`flex-1 py-4 px-6 rounded-2xl font-black text-white transition-all ${
              isSaving || !hasChanges
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] hover:opacity-90 shadow-lg'
            }`}
          >
            {isSaving ? 'Сохранение...' : 'Сохранить изменения'}
          </button>

          <button
            type="button"
            onClick={() => {
              // сброс к исходным данным
              setFormData({
                full_name: profile.full_name || '',
                email: profile.email || '',
                phone: profile.phone || '',
                birth_date: profile.birth_date || '',
                gender: profile.gender || 'male',
              });
              setHasChanges(false);
            }}
            disabled={isSaving}
            className="flex-1 py-4 px-6 rounded-2xl font-semibold border-2 border-[#fca311] text-[#ff9e00] hover:bg-orange-50 transition"
          >
            Отменить
          </button>
        </div>
      </form>

      {/* Ссылка на смену пароля (пока заглушка) */}
      <div className="mt-10 text-center">
        <button className="text-[#fca311] hover:underline font-medium">
          Сменить пароль →
        </button>
      </div>
    </div>
  );
}
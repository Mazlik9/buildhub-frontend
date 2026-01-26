// src/features/profile/components/ProfileEditForm.jsx
import { useState, useEffect } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { toast } from 'sonner';

export default function ProfileEditForm() {
  const { profile, loading, error, updateProfile } = useProfile();

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    birth_date: '',
    gender: 'male',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

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

  // ✅ Оптимизированная проверка изменений
  useEffect(() => {
    if (!profile) return;
    setHasChanges(JSON.stringify(formData) !== JSON.stringify({
      full_name: profile.full_name || '',
      email: profile.email || '',
      phone: profile.phone || '',
      birth_date: profile.birth_date || '',
      gender: profile.gender || 'male',
    }));
  }, [formData, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!hasChanges) return;

    setIsSaving(true);
    try {
      await updateProfile(formData);
      toast.success('Изменения сохранены');
      setHasChanges(false);
    } catch {
      // toast уже внутри useProfile
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) return <SkeletonForm />; // вынесём skeleton отдельно
  if (error) return <ErrorBlock error={error} />; // вынесём блок ошибки отдельно

  return (
    <div className="flex-1 bg-white rounded-2xl shadow p-8">
      <h2 className="text-3xl font-bold mb-8 text-gray-900">Редактирование профиля</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField label="ФИО" name="full_name" value={formData.full_name} onChange={handleChange} disabled={isSaving} placeholder="Иванов Иван Иванович" />
        <InputField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} disabled={isSaving} placeholder="example@email.com" />
        <InputField label="Телефон" name="phone" value={formData.phone} onChange={handleChange} disabled={isSaving} placeholder="+7 (___) ___-__-__" />
        <DateGenderFields formData={formData} handleChange={handleChange} isSaving={isSaving} />

        <ActionButtons
          isSaving={isSaving}
          hasChanges={hasChanges}
          onReset={() => setFormData({
            full_name: profile.full_name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            birth_date: profile.birth_date || '',
            gender: profile.gender || 'male',
          })}
        />
      </form>

      <div className="mt-10 text-center">
        <button className="text-[#fca311] hover:underline font-medium">
          Сменить пароль →
        </button>
      </div>
    </div>
  );
}

// src/features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { apiServices } from '@/api/services';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user, setUser } = useAuthContext(); // setUser будет undefined, если используем только контекст без модификации user. Добавим проверку.

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ===== Получение профиля =====
  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiServices.userSelf.getProfile();
      setProfile(data);

      if (typeof setUser === 'function') {
        setUser(data);
      }
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError('Не удалось загрузить данные профиля');
      toast.error('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  }, [setUser]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // ===== Обновление профиля =====
  const updateProfile = useCallback(
    async (updatedData) => {
      try {
        const newData = await apiServices.userSelf.updateProfile(updatedData);
        setProfile(newData);

        if (typeof setUser === 'function') {
          setUser(newData);
        }

        toast.success('Профиль успешно обновлён');
        return newData;
      } catch (err) {
        console.error('Ошибка обновления профиля:', err);
        toast.error('Не удалось сохранить изменения');
        throw err;
      }
    },
    [setUser]
  );

  // ===== Обновление аватара =====
  const updateAvatar = useCallback(
    async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const updated = await apiServices.userSelf.changeAvatar(formData);

        setProfile((prev) => ({ ...prev, avatar: updated.avatar }));

        if (typeof setUser === 'function') {
          setUser((prev) => ({ ...prev, avatar: updated.avatar }));
        }

        toast.success('Аватар успешно обновлён');
        return updated;
      } catch (err) {
        console.error('Ошибка загрузки аватара:', err);
        toast.error('Не удалось обновить аватар');
        throw err;
      }
    },
    [setUser]
  );

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
};

// src/features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { userSelfService } from '@/api/services';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user, setUser } = useAuthContext();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await userSelfService.getProfile(); // ← исправлено здесь
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

  const updateProfile = useCallback(async (updatedData) => {
    try {
      const newData = await userSelfService.update(updatedData);
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
  }, [setUser]);

  const updateAvatar = useCallback(async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const updated = await userSelfService.updateAvatar(formData);

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
  }, [setUser]);

  return {
    profile,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
};
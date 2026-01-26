// src/features/profile/hooks/useProfile.js
import { useState, useEffect, useCallback } from 'react';
import { useAuthContext } from '@/features/auth/AuthProvider';
import {
  getProfile,
  updateProfile as apiUpdateProfile,
  changeAvatar as apiChangeAvatar,
} from '@/api/services';
import { toast } from 'sonner';

export const useProfile = () => {
  const { user, isInitialized, updateUser } = useAuthContext();

  const [loading, setLoading] = useState(!user);
  const [error, setError] = useState(null);

  // ===== Получение профиля =====
  const fetchProfile = useCallback(async () => {
    if (!isInitialized) return;

    setLoading(true);
    setError(null);

    try {
      const data = await getProfile();
      updateUser(data);
      return data;
    } catch (err) {
      console.error('Ошибка загрузки профиля:', err);
      setError('Не удалось загрузить данные профиля');
      toast.error('Ошибка загрузки профиля');
    } finally {
      setLoading(false);
    }
  }, [updateUser, isInitialized]);

  useEffect(() => {
    if (!user && isInitialized) fetchProfile();
  }, [fetchProfile, user, isInitialized]);

  // ===== Обновление профиля =====
  const updateProfile = useCallback(
    async (updatedData) => {
      setLoading(true);
      setError(null);

      try {
        const newData = await apiUpdateProfile(updatedData);
        updateUser(newData);
        toast.success('Профиль успешно обновлён');
        return newData;
      } catch (err) {
        console.error('Ошибка обновления профиля:', err);
        setError('Не удалось сохранить изменения');
        toast.error('Не удалось сохранить изменения');
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [updateUser]
  );

  // ===== Обновление аватара =====
  const updateAvatar = useCallback(
    async (file) => {
      if (!file) return;

      const formData = new FormData();
      formData.append('avatar', file);

      try {
        const updated = await apiChangeAvatar(formData);
        updateUser(prev => ({ ...prev, avatar: updated.avatar }));
        toast.success('Аватар успешно обновлён');
        return updated;
      } catch (err) {
        console.error('Ошибка загрузки аватара:', err);
        toast.error('Не удалось обновить аватар');
        throw err;
      }
    },
    [updateUser]
  );

  return {
    profile: user,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updateAvatar,
  };
};

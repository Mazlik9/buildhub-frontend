// src/features/profile/components/ProfileCompanies/CompanyCreateModal.jsx
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { createCompany } from '@/api/services';

// =================== Схема валидации ===================
const companySchema = z.object({
  name: z.string().min(3, 'Название должно быть минимум 3 символа'),
  email: z.string().email('Некорректный email'),
  phone: z.string().min(10, 'Введите корректный телефон'),
  inn: z.string()
    .length(10, 'ИНН должен быть ровно 10 цифр')
    .regex(/^\d{10}$/, 'ИНН должен состоять только из цифр'),
  address: z.string().min(5, 'Введите адрес'),
  description: z.string()
    .min(200, 'Описание минимум 200 символов')
    .max(500, 'Максимум 500 символов'),
  logo: z.any().optional(),
});

export default function CompanyCreateModal({ isOpen, onClose, onSuccess }) {
  const [logoPreview, setLogoPreview] = useState(null);
  const [logoFile, setLogoFile] = useState(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm({
    resolver: zodResolver(companySchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      inn: '',
      address: '',
      description: '',
    },
  });

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setLogoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data) => {
    try {
      if (logoFile) {
        const formData = new FormData();
        Object.keys(data).forEach(key => formData.append(key, data[key]));
        formData.append('logo', logoFile);
        await createCompany(formData);
      } else {
        await createCompany(data);
      }

      toast.success('Компания успешно создана!');
      onSuccess?.();
      onClose?.();
      reset();
      setLogoPreview(null);
      setLogoFile(null);
    } catch (err) {
      console.error('Ошибка создания компании:', err);
      toast.error(err.response?.data?.detail || 'Не удалось создать компанию');
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-[1200px] h-[1000px] overflow-hidden rounded-[30px] bg-white/80 backdrop-blur-[25px]"
        style={{ boxShadow: '0px 4px 20px 0 rgba(0,0,0,0.2)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)} className="h-full">
          <div className="flex flex-col justify-start items-center w-[1007px] h-[931px] absolute left-24 top-[34px] gap-5">

            {/* Заголовок */}
            <p className="self-stretch flex-grow-0 flex-shrink-0 w-[1007px] text-[32px] font-bold text-center text-black">
              Создать компанию
            </p>

            <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 gap-[60px]">

              {/* Логотип + поля */}
              <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[980px] gap-10">

                {/* Блок логотипа */}
                <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[239px] gap-6">
                  <div className="flex flex-col justify-start items-center flex-grow-0 flex-shrink-0 w-[156px] relative gap-1">
                    <p className="self-stretch flex-grow-0 flex-shrink-0 w-[156px] text-base font-bold text-left text-[#fca311]">
                      Добавьте логотип
                    </p>
                    <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                      <path d="M11.09 11.0858L18.7616 3.41421C20.0215 2.15428 19.1292 0 17.3474 0L2.00421 0C0.222399 0 -0.669935 2.15428 0.589994 3.41421L8.26157 11.0858C9.04262 11.8668 10.3089 11.8668 11.09 11.0858Z" fill="#FF9E00" />
                    </svg>
                  </div>
                  <div className="relative w-[230px] h-[230px] rounded-full overflow-hidden bg-gray-200 border-4 border-[#fca311]/30">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Логотип" className="w-full h-full object-cover" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
                        Логотип компании
                      </div>
                    )}
                    <label className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                      <input type="file" accept="image/*" className="hidden" onChange={handleLogoChange} />
                      <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
                        <circle cx="26" cy="26" r="26" fill="#FF9E00" />
                        <path d="M26 16V36M16 26H36" stroke="white" strokeWidth="4" strokeLinecap="round" />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Поля ввода */}
                <div className="flex flex-col justify-start items-start flex-grow gap-[30px]">

                  {/* Название */}
                  <div className="flex flex-col justify-start items-start self-stretch gap-[3px]">
                    <div className="flex justify-start items-center self-stretch h-14 gap-3 p-4 rounded-lg bg-white w-full">
                      <input {...register('name')} placeholder="Название компании" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60" />
                    </div>
                    {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div className="flex flex-col justify-start items-start self-stretch gap-[3px]">
                    <div className="flex justify-start items-center self-stretch h-14 gap-3 p-4 rounded-lg bg-white w-full">
                      <input {...register('email')} placeholder="Email" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60" />
                    </div>
                    {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                  </div>

                  {/* Телефон + ИНН */}
                  <div className="flex justify-start items-center self-stretch gap-[38px] w-full">
                    <div className="flex flex-col justify-start items-start w-[331px] gap-[3px]">
                      <div className="flex justify-start items-center h-14 gap-3 p-4 rounded-lg bg-white w-full">
                        <input {...register('phone')} placeholder="Телефон" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60" />
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm">{errors.phone.message}</p>}
                    </div>
                    <div className="flex flex-col justify-start items-start w-[331px] gap-[3px]">
                      <div className="flex justify-start items-center h-14 gap-3 p-4 rounded-lg bg-white w-full">
                        <input {...register('inn')} placeholder="ИНН" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60" />
                      </div>
                      {errors.inn && <p className="text-red-500 text-sm">{errors.inn.message}</p>}
                    </div>
                  </div>

                  {/* Адрес */}
                  <div className="flex flex-col justify-start items-start self-stretch gap-[3px] w-full">
                    <div className="flex justify-start items-center h-14 gap-3 p-4 rounded-lg bg-white w-full">
                      <input {...register('address')} placeholder="Адрес компании" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60" />
                    </div>
                    {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                  </div>

                </div>
              </div>

              {/* Описание */}
              <div className="flex flex-col justify-start items-start w-[1000px] relative gap-[25px]">
                <p className="text-base font-bold text-left text-black">Расскажите о вашей компании</p>
                <p className="text-sm text-left text-black">Коротко опишите, чем занимается ваша компания, для кого вы работаете и в чем ваша уникальность. Этот текст может быть использован в вашем профиле на платформе.</p>
                <div className="flex flex-col justify-start items-start h-[300px] gap-[3px]" style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}>
                  <div className="flex justify-start items-start flex-grow gap-3 p-4 rounded-lg bg-white h-full">
                    <textarea {...register('description')} placeholder="О компании (200-500 символов)" className="flex-grow bg-transparent outline-none text-base text-[#484848] placeholder:text-[#484848]/60 resize-none h-full" />
                  </div>
                  {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
                </div>
              </div>

            </div>

            {/* Кнопки */}
            <div className="flex justify-center items-center w-[660px] gap-10">
              <button type="button" onClick={onClose} className="flex justify-center items-center w-[304.3px] px-6 py-4 rounded-2xl border-2 border-[#fca311]">
                <p className="text-sm font-semibold text-center text-[#ff9e00]">Отмена</p>
              </button>
              <button type="submit" disabled={isSubmitting} className="flex justify-center items-center w-[304.3px] px-6 py-4 rounded-2xl text-base font-black text-white" style={{ background: 'linear-gradient(222.67deg, #fca311 -5.98%, #ef6c1a 117.77%)', boxShadow: '0px 0px 12px 0 rgba(252,163,17,0.5)' }}>
                {isSubmitting ? 'Создание...' : 'Создать'}
              </button>
            </div>

          </div>

          {/* Крестик закрытия */}
          <button onClick={onClose} className="absolute right-6 top-6 w-14 h-14 flex items-center justify-center bg-white/80 rounded-full shadow hover:bg-gray-100 transition">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
}

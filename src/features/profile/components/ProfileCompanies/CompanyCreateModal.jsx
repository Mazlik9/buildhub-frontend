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
        className="w-[1200px] h-[1000px] relative overflow-hidden rounded-[30px] bg-white/80 backdrop-blur-[25px]"
        style={{ boxShadow: "0px 4px 20px 0 rgba(0,0,0,0.2)" }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col justify-start items-center w-[1007px] h-[931px] absolute left-24 top-[34px] gap-5">
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
                    <svg
                      width={20}
                      height={12}
                      viewBox="0 0 20 12"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="flex-grow-0 flex-shrink-0"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M11.09 11.0858L18.7616 3.41421C20.0215 2.15428 19.1292 0 17.3474 0L2.00421 0C0.222399 0 -0.669935 2.15428 0.589994 3.41421L8.26157 11.0858C9.04262 11.8668 10.3089 11.8668 11.09 11.0858Z"
                        fill="#FF9E00"
                      />
                    </svg>
                  </div>
                  <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative gap-10 pl-[169px] pr-3 pt-[174px] pb-[5px]">
                    <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
                      <div className="flex justify-center items-center w-[230px] h-[230px] rounded-full overflow-hidden">
                        {logoPreview ? (
                          <img 
                            src={logoPreview} 
                            alt="Логотип" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full rounded-full bg-[#C9C8C8] flex items-center justify-center">
                            <svg
                              width={230}
                              height={230}
                              viewBox="0 0 230 230"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-grow-0 flex-shrink-0 w-[230px] h-[230px]"
                              preserveAspectRatio="none"
                            >
                              <circle cx="115" cy="115" r="115" fill="#C9C8C8" />
                              <text
                                x="115"
                                y="125"
                                textAnchor="middle"
                                fill="#5E5E5E"
                                fontSize="14"
                                fontFamily="Arial, sans-serif"
                                fontWeight="normal"
                              >
                                Логотип компании
                              </text>
                            </svg>
                          </div>
                        )}
                      </div>
                    </div>
                    <label className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[52px] h-[52px] relative gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] cursor-pointer hover:bg-[#ef6c1a] transition-colors">
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleLogoChange} 
                      />
                      <svg
                        width={28}
                        height={28}
                        viewBox="0 0 28 28"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="flex-grow-0 flex-shrink-0"
                        preserveAspectRatio="none"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M2.01824 21.3048L0.0705036 26.4987C-0.00428869 26.6986 -0.0199663 26.9158 0.0253437 27.1243C0.0706537 27.3329 0.175036 27.524 0.326024 27.6748C0.477012 27.8256 0.668225 27.9298 0.876825 27.9749C1.08543 28.02 1.3026 28.0041 1.5024 27.9291L6.6949 25.9814C7.28922 25.7588 7.82901 25.4116 8.278 24.9631L23.3189 9.92238C23.3189 9.92238 22.7942 8.34968 21.2229 6.77698C19.6517 5.20577 18.0775 4.68104 18.0775 4.68104L3.03658 19.7217C2.58806 20.1707 2.24084 20.7105 2.01824 21.3048ZM20.1749 2.58362L22.225 0.533628C22.5926 0.166023 23.0832 -0.0681775 23.5961 0.0177947C24.318 0.136377 25.4223 0.495088 26.4628 1.53713C27.5049 2.57917 27.8636 3.68199 27.9822 4.40386C28.0682 4.91672 27.834 5.40736 27.4664 5.77496L25.4149 7.82495C25.4149 7.82495 24.8916 6.25374 23.3189 4.68252C21.7477 3.10834 20.1749 2.58362 20.1749 2.58362Z"
                          fill="white"
                        />
                      </svg>
                    </label>
                  </div>
                </div>

                {/* Поля ввода */}
                <div className="flex flex-col justify-start items-start flex-grow gap-[30px]">

                  {/* Название компании */}
                  <div
                    className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[3px]"
                    style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                  >
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
                      <div className="flex flex-col justify-start items-start flex-grow">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                          <input
                            {...register('name')}
                            placeholder="Название компании"
                            className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                          />
                        </div>
                      </div>
                    </div>
                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
                  </div>

                  {/* Email */}
                  <div
                    className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[3px]"
                    style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                  >
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
                      <div className="flex flex-col justify-start items-start flex-grow">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                          <input
                            {...register('email')}
                            placeholder="Email"
                            className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                          />
                        </div>
                      </div>
                    </div>
                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                  </div>

                  {/* Телефон + ИНН */}
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[38px]">
                    <div
                      className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[331px] gap-[3px]"
                      style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                    >
                      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
                        <div className="flex flex-col justify-start items-start flex-grow">
                          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                            <input
                              {...register('phone')}
                              placeholder="Телефон"
                              className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                            />
                          </div>
                        </div>
                      </div>
                      {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                    </div>
                    <div
                      className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[331px] gap-[3px]"
                      style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                    >
                      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
                        <div className="flex flex-col justify-start items-start flex-grow">
                          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                            <input
                              {...register('inn')}
                              placeholder="ИНН"
                              className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                            />
                          </div>
                        </div>
                      </div>
                      {errors.inn && <p className="text-red-500 text-sm mt-1">{errors.inn.message}</p>}
                    </div>
                  </div>

                  {/* Адрес компании */}
                  <div
                    className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[3px]"
                    style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                  >
                    <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-white">
                      <div className="flex flex-col justify-start items-start flex-grow">
                        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                          <input
                            {...register('address')}
                            placeholder="Адрес компании"
                            className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                          />
                        </div>
                      </div>
                    </div>
                    {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                  </div>

                </div>
              </div>

              {/* Описание компании */}
              <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[1000px] relative gap-[25px]">
                <p className="self-stretch flex-grow-0 flex-shrink-0 w-[1000px] text-base font-bold text-left text-black">
                  Расскажите о вашей компании
                </p>
                <p className="flex-grow-0 flex-shrink-0 w-[979px] text-sm text-left text-black">
                  Коротко опишите, чем занимается ваша компания, для кого вы работаете и в чем ваша
                  уникальность. Этот текст может быть использован в вашем профиле на платформе.
                </p>
                <div
                  className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[300px] gap-[3px]"
                  style={{ filter: "drop-shadow(0px 4px 16px rgba(0,0,0,0.25))" }}
                >
                  <div className="flex justify-start items-start self-stretch flex-grow gap-3 p-4 rounded-lg bg-white">
                    <div className="flex flex-col justify-start items-start flex-grow">
                      <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                        <textarea
                          {...register('description')}
                          placeholder="О компании (200-500 символов)"
                          className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full h-full resize-none placeholder:text-[#484848]"
                          rows={8}
                        />
                      </div>
                    </div>
                  </div>
                  {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>
              </div>

            </div>

            {/* Кнопки - одинакового размера */}
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[660px] gap-10">
              <button 
                type="button" 
                onClick={onClose} 
                className="flex justify-center items-center w-[304.3px] h-14 relative gap-4 px-6 py-4 rounded-2xl border-2 border-[#fca311] cursor-pointer hover:opacity-90 transition"
              >
                <p className="flex-grow-0 flex-shrink-0 text-sm font-semibold text-center text-[#ff9e00]">
                  Отмена
                </p>
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex justify-center items-center w-[304.3px] h-14 relative gap-4 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition disabled:opacity-50"
                style={{
                  background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)",
                  boxShadow: "0px 0px 12px 0 rgba(252,163,17,0.5)",
                }}
              >
                <p className="flex-grow-0 flex-shrink-0 text-base font-black text-left text-white">
                  {isSubmitting ? 'Создание...' : 'Создать'}
                </p>
              </button>
            </div>

          </div>

          {/* Крестик закрытия */}
          <button
            onClick={onClose}
            className="absolute right-6 top-6 cursor-pointer hover:opacity-80 transition"
          >
            <svg
              width={58}
              height={58}
              viewBox="0 0 58 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-[50px] h-[50px]"
              preserveAspectRatio="xMidYMid meet"
            >
              <g filter="url(#filter0_d_2690_1774)">
                <circle cx={29} cy={29} r={25} fill="#E4E4E4" />
              </g>
              <g filter="url(#filter1_i_2690_1774)">
                <path
                  d="M20.667 20.6665L29.4905 29.49M38.3141 38.3136L29.4905 29.49M29.4905 29.49L38.3141 20.6665M29.4905 29.49L20.667 38.3136"
                  stroke="#BFBFBF"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </g>
              <defs>
                <filter
                  id="filter0_d_2690_1774"
                  x={0}
                  y={0}
                  width={58}
                  height={58}
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation={2} />
                  <feComposite in2="hardAlpha" operator="out" />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
                  <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_2690_1774" />
                  <feBlend
                    mode="normal"
                    in="SourceGraphic"
                    in2="effect1_dropShadow_2690_1774"
                    result="shape"
                  />
                </filter>
                <filter
                  id="filter1_i_2690_1774"
                  x="19.667"
                  y="19.6665"
                  width="19.647"
                  height="19.647"
                  filterUnits="userSpaceOnUse"
                  colorInterpolationFilters="sRGB"
                >
                  <feFlood floodOpacity={0} result="BackgroundImageFix" />
                  <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                  <feColorMatrix
                    in="SourceAlpha"
                    type="matrix"
                    values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                    result="hardAlpha"
                  />
                  <feOffset />
                  <feGaussianBlur stdDeviation={2} />
                  <feComposite in2="hardAlpha" operator="arithmetic" k2={-1} k3={1} />
                  <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.6 0" />
                  <feBlend mode="normal" in2="shape" result="effect1_innerShadow_2690_1774" />
                </filter>
              </defs>
            </svg>
          </button>

        </form>
      </div>
    </div>
  );
}
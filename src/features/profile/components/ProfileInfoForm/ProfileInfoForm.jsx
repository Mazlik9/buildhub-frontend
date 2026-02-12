// src/features/profile/components/ProfileInfoForm/ProfileInfoForm.jsx
import { useEffect, useMemo, useState } from 'react';

const InputCard = ({ label, value, onChange, disabled = false, className = '' }) => (
  <div className={`flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-14 gap-[3px] ${className}`}>
    <div className={`flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg ${disabled ? 'bg-[#d6d6d6]' : 'bg-[#d6d6d6]'}`}>
      <div className="flex flex-col justify-start items-start flex-grow">
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
          <input
            disabled={disabled}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
          />
        </div>
      </div>
    </div>
  </div>
);

const TextAreaCard = ({ label, value, onChange }) => (
  <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[200px] gap-[3px]">
    <div className="flex justify-start items-center self-stretch flex-grow gap-3 p-4 rounded-lg bg-[#d6d6d6]">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow">
        <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={label}
            className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full h-full resize-none placeholder:text-[#484848]"
            rows={4}
          />
        </div>
      </div>
    </div>
  </div>
);

export default function ProfileInfoForm({
  profile,
  onSave,          // (payload) => Promise
  isSaving = false,
}) {
  // ===== маппинг полей профиля -> форма (делаем безопасно) =====
  const initial = useMemo(() => {
    const fullName =
      profile?.full_name ??
      [profile?.last_name, profile?.first_name, profile?.middle_name]
        .filter(Boolean)
        .join(' ') ??
      '';

    return {
      full_name: String(fullName || ''),
      about: String(profile?.about || ''),
      email: String(profile?.email || ''),
      phone: String(profile?.phone || profile?.phone_number || ''),
      birth_date: String(profile?.birth_date || profile?.birthday || ''),
      gender: profile?.gender ?? 'unspecified', // 'male' | 'female' | 'unspecified'
    };
  }, [profile]);

  const [fullName, setFullName] = useState(initial.full_name);
  const [about, setAbout] = useState(initial.about);
  const [email, setEmail] = useState(initial.email);
  const [phone, setPhone] = useState(initial.phone);
  const [birthDate, setBirthDate] = useState(initial.birth_date);
  const [gender, setGender] = useState(initial.gender);

  // если профиль пришёл позже — обновляем форму
  useEffect(() => {
    setFullName(initial.full_name);
    setAbout(initial.about);
    setEmail(initial.email);
    setPhone(initial.phone);
    setBirthDate(initial.birth_date);
    setGender(initial.gender);
  }, [initial]);

  const handleSave = async () => {
    if (!onSave) return;

    const payload = {
      full_name: fullName,
      about,
      phone: phone || null,
      birth_date: birthDate || null,
      gender: gender === 'unspecified' ? null : gender,
    };

    await onSave(payload);
  };

  return (
    <div
      className="w-[1200px] h-[900px] relative overflow-hidden rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: '0px 5px 14px 0 rgba(0,0,0,0.25)' }}
    >
      <div className="flex flex-col justify-start items-center w-[1003px] absolute left-[99px] top-[81px] gap-[65px]">
        {/* Заголовок */}
        <p className="self-stretch flex-grow-0 flex-shrink-0 w-[1003px] text-[32px] font-bold text-center text-black">
          Персональная информация
        </p>

        <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[30px]">
          {/* Аватар и основные поля */}
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[38px]">
            {/* Аватар */}
            <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[255px] h-[255px] gap-10">
              <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-[231px] w-[239px] relative gap-10">
                <svg
                  width={250}
                  height={250}
                  viewBox="0 0 250 250"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0 w-[250px] h-[250px]"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M125 0C194.036 0 250 55.9644 250 125C250 194.036 194.036 250 125 250C55.9644 250 0 194.036 0 125C0 55.9644 55.9644 0 125 0Z"
                    fill="#C9C8C8"
                  />
                  <path
                    d="M125 240.905C189.012 240.905 240.905 189.012 240.905 125C240.905 60.9876 189.012 9.09534 125 9.09534C60.9875 9.09534 9.09521 60.9876 9.09521 125C9.09521 189.012 60.9875 240.905 125 240.905Z"
                    fill="#FEFEFE"
                  />
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M125 16.1185C185.134 16.1185 233.881 64.8663 233.881 125C233.881 185.133 185.134 233.881 125 233.881C64.8667 233.881 16.1189 185.133 16.1189 125C16.1189 64.8663 64.8667 16.1185 125 16.1185Z"
                    fill="#C9C8C8"
                  />
                  <mask
                    id="mask0_2920_3390"
                    style={{ maskType: "luminance" }}
                    maskUnits="userSpaceOnUse"
                    x={16}
                    y={16}
                    width={218}
                    height={218}
                  >
                    <path
                      d="M125 16.1185C185.134 16.1185 233.881 64.8663 233.881 125C233.881 185.133 185.134 233.881 125 233.881C64.8667 233.881 16.1189 185.133 16.1189 125C16.1189 64.8663 64.8667 16.1185 125 16.1185Z"
                      fill="white"
                    />
                  </mask>
                  <g mask="url(#mask0_2920_3390)">
                    <path
                      d="M125 348.984C175.254 348.984 215.994 308.245 215.994 257.991C215.994 207.736 175.254 166.997 125 166.997C74.7458 166.997 34.0066 207.736 34.0066 257.991C34.0066 308.245 74.7458 348.984 125 348.984Z"
                      fill="#FEFEFE"
                    />
                    <path
                      d="M125 151.442C149.483 151.442 169.33 131.595 169.33 107.112C169.33 82.6291 149.483 62.7817 125 62.7817C100.517 62.7817 80.6699 82.6291 80.6699 107.112C80.6699 131.595 100.517 151.442 125 151.442Z"
                      fill="#FEFEFE"
                    />
                  </g>
                </svg>
              </div>
            </div>

            {/* ФИО и "О себе" */}
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[710px] gap-[15px]">
              {/* ФИО */}
              <InputCard 
                label="ФИО" 
                value={fullName} 
                onChange={setFullName} 
              />

              {/* О себе */}
              <TextAreaCard 
                label="О себе" 
                value={about} 
                onChange={setAbout} 
              />
            </div>
          </div>

          {/* Email и Телефон */}
          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 gap-[15px]">
            {/* Email */}
            <InputCard 
              label="Email" 
              value={email} 
              onChange={setEmail} 
              disabled
            />

            {/* Телефон */}
            <InputCard 
              label="Номер телефона" 
              value={phone} 
              onChange={setPhone} 
            />
          </div>

          {/* Дата рождения и Пол */}
          <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[47px]">
            {/* Дата рождения */}
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[478px] gap-[3px]">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-[#d6d6d6]">
                <div className="flex flex-col justify-start items-start flex-grow">
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                    <input
                      value={birthDate}
                      onChange={(e) => setBirthDate(e.target.value)}
                      placeholder="Дата рождения"
                      className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Пол */}
            <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 w-[478px] gap-[3px]">
              <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 h-14 gap-3 p-4 rounded-lg bg-[#d6d6d6]">
                <div className="flex flex-col justify-start items-start flex-grow">
                  <div className="flex justify-start items-center self-stretch flex-grow-0 flex-shrink-0 relative">
                    <input
                      value={gender === 'male' ? 'Мужчина' : 
                             gender === 'female' ? 'Женщина' : 
                             gender === 'unspecified' ? 'Не указывать' : ''}
                      readOnly
                      placeholder="Пол"
                      className="flex-grow-0 flex-shrink-0 text-base text-left text-[#484848] bg-transparent outline-none w-full placeholder:text-[#484848]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Нижняя панель с кнопками */}
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 h-[70px]">
          {/* Кнопка "Сменить пароль" */}
          <button 
            type="button"
            className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 h-8 w-[152px] relative gap-5 cursor-pointer hover:opacity-90 transition"
          >
            <p className="flex-grow-0 flex-shrink-0 w-[140.99px] text-base font-medium text-center text-[#fca311]">
              Сменить пароль
            </p>
          </button>

          {/* Кнопка сохранения */}
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[52px] h-[52px] relative gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] cursor-pointer hover:bg-[#ef6c1a] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Сохранить"
          >
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
          </button>
        </div>
      </div>
    </div>
  );
}
// src/features/profile/components/ProfileInfoForm/ProfileInfoForm.jsx
import { useEffect, useMemo, useState } from 'react';

const ShadowWrap = ({ children, className = '' }) => (
  <div
    className={`flex flex-col justify-start items-start gap-[3px] ${className}`}
    style={{ filter: 'drop-shadow(0px 4px 16px rgba(0,0,0,0.25))' }}
  >
    {children}
  </div>
);

const InputCard = ({ label, value, onChange, disabled = false }) => (
  <ShadowWrap className="self-stretch">
    <div className="flex justify-start items-center self-stretch h-14 gap-3 p-4 rounded-lg bg-white">
      <div className="flex flex-col justify-start items-start flex-grow w-full">
        <p className="text-base text-left text-[#484848]">{label}</p>
        <input
          disabled={disabled}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full outline-none bg-transparent text-black"
        />
      </div>
    </div>
  </ShadowWrap>
);

const TextAreaCard = ({ label, value, onChange }) => (
  <ShadowWrap className="w-[880px] h-[200px]">
    <div className="flex justify-start items-start self-stretch flex-grow gap-3 p-4 rounded-lg bg-white w-full h-full">
      <div className="flex flex-col justify-start items-start self-stretch flex-grow w-full h-full">
        <p className="text-base text-left text-[#484848]">{label}</p>
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full h-full resize-none outline-none bg-transparent text-black mt-2"
        />
      </div>
    </div>
  </ShadowWrap>
);

const Radio = ({ label, checked, onClick, active }) => (
  <button type="button" onClick={onClick} className="flex items-center gap-3">
    <span className="text-base text-left text-black">{label}</span>
    {active ? (
      <svg width={26} height={25} viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12.6719" cy="12.5" rx="12.1719" ry="12" fill="white" stroke="#FCA311" />
        <ellipse cx="12.6718" cy="12.5" rx="7.10029" ry="7" fill="#FF9E00" />
      </svg>
    ) : (
      <svg width={26} height={25} viewBox="0 0 26 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="12.6719" cy="12.5" rx="12.1719" ry="12" fill="white" stroke="black" />
      </svg>
    )}
  </button>
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

    // payload делаем максимально “мягким”
    // (поля могут отличаться у бэка — позже подгоним под реальные названия)
    const payload = {
      full_name: fullName,
      about,
      phone: phone || null,
      birth_date: birthDate || null,
      gender: gender === 'unspecified' ? null : gender,
      // email обычно не редактируют — оставим disabled и не отправляем
    };

    await onSave(payload);
  };

  return (
    <div
      className="w-[1200px] h-[1000px] relative overflow-hidden rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: '0px 5px 14px 0 rgba(0,0,0,0.25)' }}
    >
      {/* TITLE */}
      <div className="flex justify-center items-center w-[901px] h-[74px] absolute left-[149.5px] top-[68px] gap-2.5">
        <p className="w-[728px] h-[43px] text-[32px] font-bold text-center text-black">
          Персональная информация
        </p>
      </div>

      {/* GENDER */}
      <div className="flex justify-center items-center absolute left-[383.89px] top-[222px] gap-5">
        <Radio
          label="Мужчина"
          active={gender === 'male'}
          onClick={() => setGender('male')}
        />
        <Radio
          label="Женщина"
          active={gender === 'female'}
          onClick={() => setGender('female')}
        />
        <Radio
          label="Не указывать"
          active={gender === 'unspecified' || gender === null}
          onClick={() => setGender('unspecified')}
        />
      </div>

      {/* FIELDS */}
      <div className="flex flex-col justify-center items-center w-[900px] h-[510px] absolute left-[150px] top-[290px] gap-10 p-2.5">
        {/* FULL NAME */}
        <InputCard label="ФИО" value={fullName} onChange={setFullName} />

        {/* ABOUT */}
        <TextAreaCard label="О себе" value={about} onChange={setAbout} />

        {/* EMAIL (disabled по дизайну/логике) */}
        <InputCard label="Email" value={email} onChange={setEmail} disabled />

        {/* PHONE + BIRTH */}
        <div className="flex justify-center items-center w-[660px] gap-20 p-2.5">
          <div className="w-[400px]">
            <InputCard label="Номер телефона" value={phone} onChange={setPhone} />
          </div>
          <div className="w-[400px]">
            <InputCard label="Дата рождения" value={birthDate} onChange={setBirthDate} />
          </div>
        </div>
      </div>

      {/* SAVE BUTTON (иконка карандаша как в макете) */}
      <button
        type="button"
        onClick={handleSave}
        disabled={isSaving}
        className="flex justify-center items-center w-[52px] h-[52px] absolute left-[1111px] top-[913px] gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] disabled:opacity-60"
        title="Сохранить"
      >
        <svg
          width={28}
          height={28}
          viewBox="0 0 28 28"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
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
  );
}

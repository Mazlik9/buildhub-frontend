// src/features/profile/components/ProfileSideBar.jsx
import { useRef } from 'react';
import { useProfile } from '@/features/profile/hooks/useProfile';
import { useAuthContext } from '@/features/auth/AuthProvider';

export default function ProfileSideBar({ activeTab, onTabChange }) {
  const { profile, updateAvatar, loading } = useProfile();
  const { logout } = useAuthContext(); // берём logout из глобального контекста

  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      updateAvatar(file);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  // Разбиваем полное имя на две строки
  const getNameParts = () => {
    if (!profile?.full_name) return { firstLine: 'Пользователь', secondLine: '' };
    
    const parts = profile.full_name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return {
        firstLine: `${parts[0]} ${parts[1]}`,
        secondLine: parts.slice(2).join(' ')
      };
    }
    return {
      firstLine: profile.full_name,
      secondLine: ''
    };
  };

  // Пока идёт загрузка профиля — показываем скелетон
  if (loading || !profile) {
    return (
      <div 
        className="flex flex-col justify-start items-center w-[383px] h-[1000px] gap-[100px] px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb] animate-pulse"
        style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
      >
        <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
          <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative">
            <div className="w-[230px] h-[230px] rounded-full bg-gray-300" />
            <div className="absolute bottom-0 right-0 w-[52px] h-[52px] rounded-[26px] bg-gray-400" />
          </div>
          <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
            <div className="h-10 w-48 bg-gray-300 rounded" />
            <div className="h-8 w-32 bg-gray-300 rounded" />
          </div>
        </div>
        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 w-48 bg-gray-300 rounded-2xl" />
          ))}
        </div>
        <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-6 py-4 rounded-2xl">
            <div className="w-4 h-4 bg-gray-300 rounded" />
            <div className="h-4 w-16 bg-gray-300 rounded" />
          </div>
        </div>
      </div>
    );
  }

  const { firstLine, secondLine } = getNameParts();

  return (
    <div 
      className="flex flex-col justify-start items-center w-[383px] h-[1000px] gap-[100px] px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Аватар и имя */}
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
        <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative">
          <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
            {profile.avatar ? (
              <div className="w-[230px] h-[230px] rounded-full overflow-hidden">
                <img
                  src={profile.avatar}
                  alt="Аватар"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-[230px] h-[230px] rounded-full bg-[#C9C8C8] flex items-center justify-center text-white text-5xl font-bold">
                {profile.full_name?.[0]?.toUpperCase() || '?'}
              </div>
            )}
          </div>
          
          {/* Иконка редактирования (как в дизайне) */}
          <div 
            className="absolute bottom-0 right-0 flex justify-center items-center w-[52px] h-[52px] gap-2.5 p-3 rounded-[26px] bg-gradient-to-r from-[#fca311] to-[#ef6c1a] cursor-pointer hover:opacity-90 transition"
            onClick={handleAvatarClick}
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
          </div>

          <input
            type="file"
            ref={fileInputRef}
            accept="image/*"
            className="hidden"
            onChange={handleFileSelect}
          />
        </div>

        {/* Имя пользователя */}
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
          <p className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
            <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
              {firstLine}
            </span>
            {secondLine && (
              <>
                <br />
                <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
                  {secondLine}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Навигация по табам */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5 w-full">
        <button
          onClick={() => onTabChange('edit')}
          className={`flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4 px-6 py-4 rounded-2xl w-full ${
            activeTab === 'edit'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold shadow-lg hover:opacity-90 transition'
              : 'text-[#484848] hover:opacity-90 transition'
          }`}
        >
          <p className="flex-grow-0 flex-shrink-0 text-left text-xl">
            Мой профиль
          </p>
        </button>

        <button
          onClick={() => onTabChange('ads')}
          className={`flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4 px-6 py-4 rounded-2xl w-full ${
            activeTab === 'ads'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold shadow-lg hover:opacity-90 transition'
              : 'text-[#484848] hover:opacity-90 transition'
          }`}
        >
          <p className="flex-grow-0 flex-shrink-0 text-left text-xl">
            Мои объявления
          </p>
        </button>

        <button
          onClick={() => onTabChange('companies')}
          className={`flex justify-start items-center flex-grow-0 flex-shrink-0 gap-4 px-6 py-4 rounded-2xl w-full ${
            activeTab === 'companies'
              ? 'bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold shadow-lg hover:opacity-90 transition'
              : 'text-[#484848] hover:opacity-90 transition'
          }`}
        >
          <p className="flex-grow-0 flex-shrink-0 text-left text-xl">
            Мои компании
          </p>
        </button>
      </div>

      {/* Кнопка выхода */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5 w-full">
        <button
          onClick={logout}
          className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-2 px-6 py-4 rounded-2xl text-red-600 hover:bg-red-50 transition w-full"
        >
          <svg
            width={18}
            height={18}
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="flex-grow-0 flex-shrink-0"
            preserveAspectRatio="none"
          >
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M6.5 0.75C6.5 0.33579 6.1642 0 5.75 0H2.75C1.2312 0 0 1.23122 0 2.75V14.75C0 16.2688 1.2312 17.5 2.75 17.5H5.75C6.1642 17.5 6.5 17.1642 6.5 16.75C6.5 16.3358 6.1642 16 5.75 16H2.75C2.0596 16 1.5 15.4404 1.5 14.75V2.75C1.5 2.05964 2.0596 1.5 2.75 1.5H5.75C6.1642 1.5 6.5 1.16421 6.5 0.75ZM12.2197 4.21967C11.9268 4.51256 11.9268 4.98744 12.2197 5.28033L14.9393 8H4.75C4.3358 8 4 8.3358 4 8.75C4 9.1642 4.3358 9.5 4.75 9.5H14.9393L12.2197 12.2197C11.9268 12.5126 11.9268 12.9874 12.2197 13.2803C12.5126 13.5732 12.9874 13.5732 13.2803 13.2803L17.2803 9.2803C17.421 9.1397 17.5 8.9489 17.5 8.75C17.5 8.5511 17.421 8.3603 17.2803 8.2197L13.2803 4.21967C12.9874 3.92678 12.5126 3.92678 12.2197 4.21967Z"
              fill="#FA1414"
            />
          </svg>
          <p className="flex-grow-0 flex-shrink-0 text-sm font-medium text-left text-[#fa1414]">
            Выйти
          </p>
        </button>
      </div>
    </div>
  );
}
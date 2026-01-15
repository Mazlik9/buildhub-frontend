import React from 'react';

const ProfileSideBar = () => {
  return (
    <div
      className="flex flex-col justify-start items-center w-[383px] h-[860px] gap-16 px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
    >
      {/* Аватар с иконкой редактирования */}
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
        <div className="flex flex-col justify-center items-center self-stretch flex-grow-0 flex-shrink-0 h-[230px] relative gap-10 pl-[169px] pr-3 pt-[174px] pb-[5px]">
          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 absolute left-[5px] top-0 overflow-hidden gap-2.5">
            <svg
              width={230}
              height={230}
              viewBox="0 0 230 230"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0 w-[230px] h-[230px]"
              preserveAspectRatio="none"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M115 0C178.513 0 230 51.4872 230 115C230 178.513 178.513 230 115 230C51.4872 230 0 178.513 0 115C0 51.4872 51.4872 0 115 0Z"
                fill="#C9C8C8"
              />
              <path
                d="M115 221.632C173.891 221.632 221.632 173.891 221.632 115C221.632 56.1086 173.891 8.36768 115 8.36768C56.1086 8.36768 8.36768 56.1086 8.36768 115C8.36768 173.891 56.1086 221.632 115 221.632Z"
                fill="#FEFEFE"
              />
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M115 14.8292C170.323 14.8292 215.171 59.6772 215.171 115C215.171 170.323 170.323 215.171 115 215.171C59.6773 215.171 14.8293 170.323 14.8293 115C14.8293 59.6772 59.6773 14.8292 115 14.8292Z"
                fill="#C9C8C8"
              />
              <mask
                id="mask0_2487_332"
                style={{ maskType: "luminance" }}
                maskUnits="userSpaceOnUse"
                x={14}
                y={14}
                width={202}
                height={202}
              >
                <path
                  d="M115 14.8292C170.323 14.8292 215.171 59.6772 215.171 115C215.171 170.323 170.323 215.171 115 215.171C59.6773 215.171 14.8293 170.323 14.8293 115C14.8293 59.6772 59.6773 14.8292 115 14.8292Z"
                  fill="white"
                />
              </mask>
              <g mask="url(#mask0_2487_332)">
                <path
                  d="M115 321.065C161.234 321.065 198.714 283.585 198.714 237.351C198.714 191.117 161.234 153.637 115 153.637C68.7662 153.637 31.2861 191.117 31.2861 237.351C31.2861 283.585 68.7662 321.065 115 321.065Z"
                  fill="#FEFEFE"
                />
                <path
                  d="M115 139.327C137.524 139.327 155.784 121.068 155.784 98.5432C155.784 76.0189 137.524 57.7594 115 57.7594C92.4759 57.7594 74.2163 76.0189 74.2163 98.5432C74.2163 121.068 92.4759 139.327 115 139.327Z"
                  fill="#FEFEFE"
                />
              </g>
            </svg>
          </div>
          {/* Кнопка редактирования аватара */}
          <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[52px] h-[52px] relative gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] hover:bg-[#e68a00] transition-colors cursor-pointer">
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
        
        {/* Имя пользователя */}
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
          <p className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
            <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
              Иванов Иван
            </span>
            <br />
            <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
              Иванович
            </span>
          </p>
        </div>
      </div>

      {/* Основное меню */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5">
        <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer">
          <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-[#ff9e00]">
            Редактировать профиль
          </p>
        </button>
        <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer">
          <p className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#484848]">
            Мои объявления
          </p>
        </button>
        <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer">
          <p className="flex-grow-0 flex-shrink-0 text-xl text-left text-[#484848]">
            Мои компании
          </p>
        </button>
      </div>

      {/* Кнопка выхода */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5">
        <button className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl hover:bg-gray-200 transition-colors cursor-pointer">
          <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#4b4b4b]">
            Выйти
          </p>
        </button>
      </div>
    </div>
  );
};

export default ProfileSideBar;
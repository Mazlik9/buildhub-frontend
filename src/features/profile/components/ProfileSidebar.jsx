// src/features/profile/components/ProfileSideBar.jsx
import { useMemo } from 'react';

export default function ProfileSideBar({
  profile,
  tabs = [],
  activeTab,
  onChangeTab,
  onLogout,
}) {
  const fullName = useMemo(() => {
    const name = profile?.full_name?.trim();
    if (name) return name;
    const first = profile?.first_name?.trim();
    const last = profile?.last_name?.trim();
    const middle = profile?.middle_name?.trim();
    return [last, first, middle].filter(Boolean).join(' ') || 'Пользователь';
  }, [profile]);

  // Разбиваем имя на 2 строки как в макете
  const nameLines = useMemo(() => {
    const parts = fullName.split(/\s+/).filter(Boolean);
    if (parts.length <= 2) return [parts.join(' '), ''];
    return [`${parts[0]} ${parts[1]}`, parts.slice(2).join(' ')];
  }, [fullName]);

  const isActive = (id) => id === activeTab;

  return (
    <div
      className="flex flex-col justify-start items-center w-[383px] h-[900px] gap-[60px] px-[72px] pt-10 pb-2.5 rounded-[30px] bg-[#ebebeb]"
      style={{ boxShadow: "0px 5px 14px 0 rgba(0,0,0,0.25)" }}
    >
      <div className="flex flex-col justify-start items-center self-stretch flex-grow-0 flex-shrink-0 gap-[25px]">
        {/* Аватар */}
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
        </div>
        
        {/* Имя пользователя */}
        <div className="flex flex-col justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5 p-2.5">
          <p className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
            <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
              {nameLines[0]}
            </span>
            {nameLines[1] && (
              <>
                <br />
                <span className="flex-grow-0 flex-shrink-0 text-[32px] font-bold text-center text-black">
                  {nameLines[1]}
                </span>
              </>
            )}
          </p>
        </div>
      </div>

      {/* Меню */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => onChangeTab?.(t.id)}
            className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-4 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition"
            style={
              isActive(t.id)
                ? { background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)" }
                : undefined
            }
          >
            <p className={
              isActive(t.id)
                ? "flex-grow-0 flex-shrink-0 text-base font-black text-left text-white"
                : "flex-grow-0 flex-shrink-0 text-xl text-left text-[#484848]"
            }>
              {t.label}
            </p>
          </button>
        ))}
      </div>

      {/* Кнопка выхода */}
      <div className="flex flex-col justify-start items-start flex-grow-0 flex-shrink-0 gap-2.5">
        <button
          type="button"
          onClick={() => onLogout?.()}
          className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition"
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
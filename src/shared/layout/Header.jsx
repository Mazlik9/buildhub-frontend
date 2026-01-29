// src/shared/layout/Header.jsx
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/features/auth/AuthProvider';
import { AuthFormModal } from '@/features/auth/components/AuthFormModal';

export default function Header() {
  const { user, isLoggedIn, isInitialized, logout, getInitials } = useAuthContext();
  const navigate = useNavigate();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // login | register
  const [profileOpen, setProfileOpen] = useState(false);

  const dropdownRef = useRef(null);

  const mediaBaseUrl = import.meta.env.VITE_MEDIA_URL || '';

  const avatarSrc = useMemo(() => {
    if (!user?.avatar) return null;
    return String(user.avatar);
  }, [user?.avatar]);

  // ✅ Закрывать дропдаун при клике вне (удобно)
  useEffect(() => {
    if (!profileOpen) return;

    const onClickOutside = (e) => {
      if (!dropdownRef.current) return;
      if (!dropdownRef.current.contains(e.target)) setProfileOpen(false);
    };

    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, [profileOpen]);

  /* ================= Handlers ================= */

  const openLogin = () => {
    setAuthMode('login');
    setAuthModalOpen(true);
  };

  const openRegister = () => {
    setAuthMode('register');
    setAuthModalOpen(true);
  };

  const handleLogout = async () => {
    await logout(); // ✅ services.logout чистит токены, AuthProvider чистит user
    setProfileOpen(false);
    navigate('/');
  };

  const goProfile = () => {
    navigate('/profile');
    setProfileOpen(false);
  };

  /* ================= UI parts ================= */

  const AvatarCircle = () => {
    if (avatarSrc) {
      return (
        <img
          src={avatarSrc}
          alt="avatar"
          className="w-12 h-12 rounded-full object-cover"
        />
      );
    }

    // Иконка профиля по дизайну
    return (
      <svg
        width={48}
        height={48}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-grow-0 flex-shrink-0 w-12 h-12"
        preserveAspectRatio="xMidYMid meet"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M24 0C37.2548 0 48 10.7452 48 24C48 37.2548 37.2548 48 24 48C10.7452 48 0 37.2548 0 24C0 10.7452 10.7452 0 24 0Z"
          fill="#C9C8C8"
        />
        <path
          d="M23.9993 46.2537C36.2897 46.2537 46.253 36.2903 46.253 24C46.253 11.7096 36.2897 1.74627 23.9993 1.74627C11.7089 1.74627 1.74561 11.7096 1.74561 24C1.74561 36.2903 11.7089 46.2537 23.9993 46.2537Z"
          fill="#FEFEFE"
        />
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M23.9999 3.0948C35.5455 3.0948 44.9051 12.4544 44.9051 24C44.9051 35.5456 35.5455 44.9052 23.9999 44.9052C12.4543 44.9052 3.09473 35.5456 3.09473 24C3.09473 12.4544 12.4543 3.0948 23.9999 3.0948Z"
          fill="#C9C8C8"
        />
        <mask
          id="mask0_2587_302"
          style={{ maskType: "luminance" }}
          maskUnits="userSpaceOnUse"
          x={3}
          y={3}
          width={42}
          height={42}
        >
          <path
            d="M23.9999 3.09477C35.5455 3.09477 44.9051 12.4543 44.9051 24C44.9051 35.5456 35.5455 44.9052 23.9999 44.9052C12.4543 44.9052 3.09473 35.5456 3.09473 24C3.09473 12.4543 12.4543 3.09477 23.9999 3.09477Z"
            fill="white"
          />
        </mask>
        <g mask="url(#mask0_2587_302)">
          <path
            d="M24.001 67.005C33.6499 67.005 41.4718 59.1831 41.4718 49.5343C41.4718 39.8854 33.6499 32.0635 24.001 32.0635C14.3522 32.0635 6.53027 39.8854 6.53027 49.5343C6.53027 59.1831 14.3522 67.005 24.001 67.005Z"
            fill="#FEFEFE"
          />
          <path
            d="M24.0007 29.0769C28.7014 29.0769 32.5121 25.2662 32.5121 20.5655C32.5121 15.8648 28.7014 12.0541 24.0007 12.0541C19.2999 12.0541 15.4893 15.8648 15.4893 20.5655C15.4893 25.2662 19.2999 29.0769 24.0007 29.0769Z"
            fill="#FEFEFE"
          />
        </g>
      </svg>
    );
  };

  return (
    <>
      {/* Фон */}
      <div className="w-full bg-[#ef6c1a] flex justify-center">
        {/* Контейнер (как в фигме), но адаптивный */}
        <div className="w-full max-w-[1920px] h-[75px] flex justify-center items-center gap-[120px]">
          {/* LEFT */}
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 gap-10">
            {/* LOGO */}
            <Link to="/" className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-2.5">
              <div className="flex-grow-0 flex-shrink-0 w-[52px] h-[50px] rounded-[9px] bg-[#d9d9d9]" />
              <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-white">
                BUILDHUB
              </p>
            </Link>

            {/* CATALOG */}
            <button
              type="button"
              className="flex justify-center items-center flex-grow-0 flex-shrink-0 w-[207px] relative overflow-hidden gap-2.5 px-[18px] py-[15px] rounded-[20px] bg-[#2c3f4d]"
              onClick={() => {
                // сюда можешь повесить открытие каталога/страницы каталога
              }}
            >
              <svg
                width={32}
                height={22}
                viewBox="0 0 32 22"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0"
                preserveAspectRatio="none"
              >
                <path
                  d="M0 1.63396C0 0.73155 0.73155 0 1.63396 0H24.9179C25.8203 0 26.5519 0.73155 26.5519 1.63396C26.5519 2.53637 25.8203 3.26793 24.9179 3.26793H1.63396C0.731552 3.26793 0 2.53637 0 1.63396Z"
                  fill="white"
                />
                <path
                  d="M0 9.59952C0 8.69711 0.73155 7.96556 1.63396 7.96556H11.8462C12.7486 7.96556 13.4802 8.69711 13.4802 9.59952C13.4802 10.5019 12.7486 11.2335 11.8462 11.2335H1.63396C0.731549 11.2335 0 10.5019 0 9.59952Z"
                  fill="white"
                />
                <path
                  d="M0 17.5651C0 16.6627 0.73155 15.9311 1.63396 15.9311H11.8462C12.7486 15.9311 13.4802 16.6627 13.4802 17.5651C13.4802 18.4675 12.7486 19.199 11.8462 19.199H1.63396C0.731549 19.199 0 18.4675 0 17.5651Z"
                  fill="white"
                />
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M22.2625 5.92311C26.3232 5.92311 29.6158 9.21492 29.616 13.2756C29.616 14.762 29.1732 16.1443 28.4148 17.301L30.8474 19.7337C31.3657 20.252 31.3656 21.0922 30.8474 21.6106C30.329 22.1291 29.4879 22.1291 28.9695 21.6106L26.5828 19.2239C25.3696 20.1066 23.8774 20.6292 22.2625 20.6292C18.2017 20.629 14.9099 17.3364 14.9099 13.2756C14.9101 9.21502 18.2018 5.92326 22.2625 5.92311ZM22.2625 8.37428C19.5555 8.37447 17.3613 10.5687 17.3611 13.2756C17.3611 15.9828 19.5554 18.1778 22.2625 18.178C24.9697 18.178 27.1648 15.9829 27.1648 13.2756C27.1646 10.5685 24.9696 8.37428 22.2625 8.37428Z"
                  fill="white"
                />
              </svg>
              <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-white">
                Каталог
              </p>
            </button>
          </div>

          {/* SEARCH */}
          <div className="flex justify-between items-center flex-grow-0 flex-shrink-0 w-[700px] relative overflow-hidden px-5 py-3.5 rounded-[20px] bg-white">
            <p className="flex-grow-0 flex-shrink-0 text-xl font-light text-left text-[#878787]">
              Поиск по сайту
            </p>
            <svg
              width={23}
              height={23}
              viewBox="0 0 23 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="flex-grow-0 flex-shrink-0"
              preserveAspectRatio="none"
            >
              <path
                d="M9.11289 0C4.08531 0 0 3.99226 0 8.90534C0 13.8184 4.08531 17.8107 9.11289 17.8107C11.1021 17.8107 12.9406 17.1845 14.4399 16.1246L21.4924 23L23 21.5267L16.0313 14.7004C17.4008 13.1411 18.2258 11.1173 18.2258 8.90534C18.2258 3.99226 14.1405 0 9.11289 0ZM9.11289 1.04769C13.5605 1.04769 17.1537 4.55907 17.1537 8.90534C17.1537 13.2516 13.5605 16.763 9.11289 16.763C4.66533 16.763 1.0721 13.2516 1.0721 8.90534C1.0721 4.55907 4.66533 1.04769 9.11289 1.04769Z"
                fill="#979797"
              />
            </svg>
          </div>

          {/* RIGHT (2 состояния) */}
          {!isInitialized ? (
            // пока инициализация — ничего не показываем (чтобы не мигало)
            <div className="w-[244px] h-[52px]" />
          ) : isLoggedIn ? (
            // ===== STATE: LOGGED IN ===== (по дизайну)
            <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-[23px]">
              {/* ICON 1 - сообщения */}
              <svg
                width={52}
                height={52}
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-[52px] h-[52px]"
                preserveAspectRatio="none"
              >
                <circle cx={26} cy={26} r={26} fill="#D9D9D9" />
                <path d="M21 24H31" stroke="#878787" strokeWidth={2} strokeLinecap="round" />
                <path d="M21 28H28" stroke="#878787" strokeWidth={2} strokeLinecap="round" />
                <path
                  d="M32 15.6054C30.2349 14.5844 28.1857 14 26 14C19.3726 14 14 19.3726 14 26C14 27.9196 14.4507 29.7339 15.2522 31.343C15.4651 31.7706 15.536 32.2593 15.4125 32.7207L14.6978 35.392C14.3875 36.5516 15.4484 37.6124 16.608 37.3022L19.2793 36.5875C19.7407 36.464 20.2295 36.5349 20.657 36.7478C22.266 37.5493 24.0804 38 26 38C32.6274 38 38 32.6274 38 26C38 23.8143 37.4156 21.765 36.3946 20"
                  stroke="#878787"
                  strokeWidth={2}
                  strokeLinecap="round"
                />
              </svg>

              {/* ICON 2 - уведомления */}
              <svg
                width={52}
                height={52}
                viewBox="0 0 52 52"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="flex-grow-0 flex-shrink-0 w-[52px] h-[52px]"
                preserveAspectRatio="none"
              >
                <circle cx={26} cy={26} r={26} fill="#D9D9D9" />
                <path
                  d="M23.5 35.5H28.5C28.5 36.163 28.2366 36.7989 27.7678 37.2678C27.2989 37.7366 26.663 38 26 38C25.337 38 24.7011 37.7366 24.2322 37.2678C23.7634 36.7989 23.5 36.163 23.5 35.5ZM33.5 30.5V23C33.4982 21.2289 32.8697 19.5156 31.7258 18.1635C30.5818 16.8114 28.9963 15.9077 27.25 15.6125V14.25C27.25 13.9185 27.1183 13.6005 26.8839 13.3661C26.6495 13.1317 26.3315 13 26 13C25.6685 13 25.3505 13.1317 25.1161 13.3661C24.8817 13.6005 24.75 13.9185 24.75 14.25V15.6125C23.0037 15.9077 21.4182 16.8114 20.2742 18.1635C19.1303 19.5156 18.5018 21.2289 18.5 23V30.5L16 33H36L33.5 30.5Z"
                  fill="#878787"
                />
                <circle cx={45} cy={7} r={7} fill="#E30000" />
              </svg>

              {/* PROFILE BUTTON */}
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setProfileOpen((p) => !p)}
                  className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[97px] h-[52px] relative gap-[13px] pl-0.5 pr-3 py-[19px] rounded-[30px] bg-[#2c3f4d]"
                >
                  <AvatarCircle />
                  <svg
                    width={21}
                    height={11}
                    viewBox="0 0 21 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="flex-grow-0 flex-shrink-0"
                    preserveAspectRatio="xMidYMid meet"
                  >
                    <path
                      d="M1.5 1.50002L10.5 9.50002L19.5 1.50002"
                      stroke="white"
                      strokeWidth={3}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                {profileOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white rounded-xl shadow-xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b">
                      <p className="font-semibold">{user?.full_name || 'Пользователь'}</p>
                      <p className="text-sm text-gray-500">{user?.email}</p>
                    </div>

                    <button
                      onClick={goProfile}
                      className="w-full text-left px-4 py-3 hover:bg-gray-100"
                    >
                      Мой профиль
                    </button>

                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-3 text-red-600 hover:bg-gray-100 border-t"
                    >
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // ===== STATE: NOT LOGGED IN (как дизайн) =====
            <button
              type="button"
              onClick={openLogin}
              className="flex-grow-0 flex-shrink-0 w-[244px] h-[52px] relative overflow-hidden rounded-[20px] bg-[#2c3f4d]"
            >
              <div className="flex justify-start items-center absolute left-[30px] top-3.5 gap-[55px]">
                <svg
                  width={22}
                  height={24}
                  viewBox="0 0 22 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="flex-grow-0 flex-shrink-0"
                  preserveAspectRatio="xMidYMid meet"
                >
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M10.3755 0.0162995C8.84972 0.205741 7.62185 0.769698 6.56431 1.76678C4.22674 3.97071 3.97652 7.54136 5.98289 10.0635C7.91289 12.4897 11.4377 13.1737 14.1463 11.6476C16.5391 10.2995 17.7746 7.68116 17.2626 5.04284C16.7905 2.60954 14.7815 0.625198 12.2831 0.124498C11.8078 0.0292138 10.7532 -0.0305678 10.3755 0.0162995ZM5.86026 12.9964C3.73409 13.3614 1.78373 14.6518 0.567389 16.4984C0.310402 16.8885 0 17.5496 0 17.7067C0 18.0154 0.913576 19.2716 1.77729 20.1505C3.88756 22.298 6.48909 23.5778 9.4869 23.9434C10.1111 24.0195 11.8512 24.0187 12.4651 23.9419C14.8944 23.6383 17.0559 22.7512 18.9258 21.2904C19.5049 20.8379 20.647 19.6848 21.0952 19.1002C21.6013 18.4398 22 17.8064 22 17.6627C22 17.5232 21.7286 16.9453 21.4952 16.5877C20.6751 15.3315 19.5321 14.3102 18.2486 13.6869C17.3121 13.2321 16.145 12.9162 15.5555 12.9579C15.3496 12.9724 15.218 13.0164 15.0261 13.1348C14.3315 13.5634 14.1137 13.6828 13.7268 13.8473C12.7736 14.2524 11.7995 14.4308 10.7598 14.3904C9.43228 14.3389 8.32076 13.9906 7.21177 13.2787C6.97049 13.1237 6.7136 12.9841 6.64093 12.9682C6.5682 12.9525 6.47631 12.9328 6.43668 12.9247C6.39705 12.9164 6.13766 12.9488 5.86026 12.9964Z"
                    fill="white"
                  />
                </svg>
                <p className="flex-grow-0 flex-shrink-0 text-xl font-bold text-left text-white">
                  Войти
                </p>
              </div>
            </button>
          )}
        </div>
      </div>

      {/* ===== AUTH MODAL ===== */}
      <AuthFormModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onSwitchMode={() => setAuthMode((prev) => (prev === 'login' ? 'register' : 'login'))}
        // ✅ вот это и делает "обновлялся сразу" —
        // AuthProvider после login/register уже делает setUser(profile),
        // а Header читает user из контекста → ререндер автоматически.
        onSuccess={() => setAuthModalOpen(false)}
      />
    </>
  );
}
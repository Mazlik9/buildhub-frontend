// src/features/profile/components/ProfileCompanies/ProfileCompanies.jsx
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import {
  getMyCompanies,
  getCompanyBySlug,
} from '@/api/services';
import CompanyCreateModal from './CompanyCreateModal';

export default function ProfileCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCompanySlug, setExpandedCompanySlug] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});

  // ===== Загрузка списка компаний =====
  const fetchCompanies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getMyCompanies();
      setCompanies(data.results || data);
    } catch (err) {
      console.error('Ошибка загрузки компаний:', err);
      setError('Не удалось загрузить список компаний');
      toast.error('Ошибка загрузки компаний');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCompanies();
  }, [fetchCompanies]);

  // ===== Загрузка деталей компании =====
  const fetchCompanyDetails = async (slug) => {
    if (expandedDetails[slug]) return;

    setDetailsLoading((prev) => ({ ...prev, [slug]: true }));
    try {
      const data = await getCompanyBySlug(slug);
      setExpandedDetails((prev) => ({ ...prev, [slug]: data }));
    } catch (err) {
      console.error('Ошибка загрузки деталей:', err);
      toast.error('Не удалось загрузить информацию о компании');
    } finally {
      setDetailsLoading((prev) => ({ ...prev, [slug]: false }));
    }
  };

  // ===== Переключение раскрытия компании =====
  const toggleExpand = (slug) => {
    if (expandedCompanySlug === slug) {
      setExpandedCompanySlug(null);
    } else {
      setExpandedCompanySlug(slug);
      fetchCompanyDetails(slug);
    }
  };

  // ===== Обработчик создания компании =====
  const handleCompanyCreated = () => {
    setIsModalOpen(false);
    fetchCompanies();
  };

  // ===== Skeleton / Error =====
  if (loading) {
    return (
      <div className="flex flex-col justify-start items-center w-[1200px] h-[1000px] gap-6 px-[150px] pt-10 pb-[60px] rounded-[30px] bg-[#ebebeb] animate-pulse"
           style={{ boxShadow: "0px 5px 14px rgba(0,0,0,0.25)" }}>
        <div className="w-[728px] h-[74px] bg-gray-300 rounded mb-8" />
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-[90px] bg-gray-300 rounded-[20px] w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center w-[1200px] h-[1000px] gap-6 px-[150px] py-[60px] rounded-[30px] bg-[#ebebeb] text-center"
           style={{ boxShadow: "0px 5px 14px rgba(0,0,0,0.25)" }}>
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button
          onClick={fetchCompanies}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:opacity-90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  // ===== Основной UI =====
  return (
    <div
      className={`flex flex-col w-[1200px] h-[1000px] overflow-y-auto gap-[60px] px-40 py-10 rounded-[30px] bg-[#ebebeb] ${
        companies.length === 0 ? 'items-center justify-center' : ''
      }`}
      style={{ boxShadow: "0px 5px 14px rgba(0,0,0,0.25)" }}
    >
      {companies.length > 0 && (
        <div className="flex justify-between items-center w-full">
          <p className="text-[32px] font-bold text-black">Мои компании</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex justify-center items-center w-[304px] px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition"
            style={{ background: "linear-gradient(to right, #fca311 -2.31%, #ef6c1a 102.31%)" }}
          >
            <p className="text-base font-black text-white">Добавить компанию</p>
          </button>
        </div>
      )}

      {companies.length === 0 ? (
        <div className="flex flex-col items-center justify-center w-full">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef6c1a" strokeWidth="2">
              <path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
              <path d="M9 21V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11" />
              <path d="M12 3v6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">У вас пока нет компаний</h3>
          <p className="text-gray-600 mb-8 max-w-md text-center">
            Создайте свою первую компанию и начните размещать объявления от её имени!
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-8 py-4 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition"
          >
            Создать компанию
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-[30px]">
          {companies.map((company) => {
            const slug = company.slug;
            const isExpanded = expandedCompanySlug === slug;
            const details = expandedDetails[slug];
            const isDetailsLoading = detailsLoading[slug];

            return (
              <div key={slug}>
                {isExpanded ? (
                  <div
                    className="flex-grow-0 flex-shrink-0 w-[880px] h-[541px] relative overflow-hidden rounded-[30px]"
                    style={{ background: "linear-gradient(226.41deg, #fff4e5 10.44%, #fff 98.97%)" }}
                  >
                    {isDetailsLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : details ? (
                      <>
                        {/* Аватар компании */}
                        <svg
                          width={218}
                          height={218}
                          viewBox="0 0 218 218"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-[95px] top-9"
                          preserveAspectRatio="xMidYMid meet"
                        >
                          <circle cx={109} cy={109} r={109} fill="#D9D9D9" />
                        </svg>

                        {/* Стрелка для сворачивания */}
                        <svg
                          width={21}
                          height={11}
                          viewBox="0 0 21 11"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          className="absolute left-[837.5px] top-[34.5px] cursor-pointer"
                          preserveAspectRatio="xMidYMid meet"
                          onClick={() => toggleExpand(slug)}
                        >
                          <path
                            d="M19.5 9.5L10.5 1.5L1.5 9.5"
                            stroke="#FCA311"
                            strokeWidth={3}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        {/* Контактная информация */}
                        <div className="flex flex-col justify-center items-start absolute left-[45px] top-[284px] gap-[15px]">
                          {/* Email */}
                          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-5">
                            <svg
                              width={42}
                              height={42}
                              viewBox="0 0 42 42"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-grow-0 flex-shrink-0"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M10 0C4.48867 0 0 4.48867 0 10V32C0 37.5113 4.48867 42 10 42H32C37.5113 42 42 37.5113 42 32V10C42 4.48867 37.5113 0 32 0H10ZM9 12H33C33.18 12 33.3498 12.0203 33.5098 12.0703L23.6797 21.8906C22.1997 23.3706 19.7905 23.3706 18.3105 21.8906L8.49023 12.0703C8.65023 12.0203 8.82 12 9 12ZM7.07031 13.4902L14.5898 21L7.07031 28.5098C7.02031 28.3498 7 28.18 7 28V14C7 13.82 7.02031 13.6502 7.07031 13.4902ZM34.9297 13.4902C34.9797 13.6502 35 13.82 35 14V28C35 28.18 34.9797 28.3498 34.9297 28.5098L27.4004 21L34.9297 13.4902ZM16 22.4102L16.8906 23.3105C18.0206 24.4405 19.5102 25 20.9902 25C22.4802 25 23.9598 24.4405 25.0898 23.3105L25.9902 22.4102L33.5098 29.9297C33.3498 29.9797 33.18 30 33 30H9C8.82 30 8.65023 29.9797 8.49023 29.9297L16 22.4102Z"
                                fill="#4C4C4C"
                              />
                            </svg>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#484848]">
                              email:{" "}
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-black">
                              {details.email || 'Не указан'}
                            </p>
                          </div>

                          {/* Телефон */}
                          <div className="flex justify-center items-center flex-grow-0 flex-shrink-0 relative gap-5">
                            <svg
                              width={42}
                              height={42}
                              viewBox="0 0 42 42"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-grow-0 flex-shrink-0"
                              preserveAspectRatio="none"
                            >
                              <path
                                d="M10 0C4.48867 0 0 4.48867 0 10V32C0 37.5113 4.48867 42 10 42H32C37.5113 42 42 37.5113 42 32V10C42 4.48867 37.5113 0 32 0H10ZM14.0059 8.04297C14.6339 8.06997 15.2106 8.4238 15.5586 8.9668C15.9546 9.5848 16.5691 10.5439 17.3691 11.7949C18.0991 12.9359 18.15 14.4096 17.498 15.5996L16.0332 17.6836C15.6372 18.2476 15.5582 18.9695 15.8242 19.6055C16.2382 20.5955 17.0408 22.117 18.4668 23.543C19.8928 24.969 21.4143 25.7715 22.4043 26.1855C23.0403 26.4515 23.7622 26.3726 24.3262 25.9766L26.4102 24.5117C27.6002 23.8597 29.0738 23.9116 30.2148 24.6406C31.4658 25.4406 32.425 26.0552 33.043 26.4512C33.586 26.7992 33.9398 27.3759 33.9668 28.0039C34.1208 31.5679 31.3596 33.0117 30.5566 33.0117C30.0006 33.0117 23.3163 33.7714 15.7773 26.2324C8.23834 18.6934 8.99805 12.0091 8.99805 11.4531C8.99805 10.6501 10.4419 7.88897 14.0059 8.04297Z"
                                fill="#4C4C4C"
                              />
                            </svg>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#484848]">
                              Телефон
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-black">
                              {details.phone || 'Не указан'}
                            </p>
                          </div>

                          {/* Адрес */}
                          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-5">
                            <svg
                              width={42}
                              height={40}
                              viewBox="0 0 42 40"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                              className="flex-grow-0 flex-shrink-0"
                              preserveAspectRatio="xMidYMid meet"
                            >
                              <path
                                d="M21 0C20.8097 0 20.6201 0.0600527 20.4583 0.181926L0.333609 15.8089C-0.0426344 16.1049 -0.112565 16.6517 0.18493 17.0348C0.482425 17.4091 1.03209 17.4787 1.41709 17.1827L2.62532 16.2442V39.1295C2.62532 39.6083 3.01906 40 3.5003 40H15.7501V24.3305H26.2499V40H38.4997C38.9809 40 39.3747 39.6083 39.3747 39.1295V16.2442L40.5829 17.1827C40.7492 17.3046 40.9322 17.3663 41.1247 17.3663C41.3871 17.3663 41.6401 17.2524 41.8151 17.0348C42.1126 16.6517 42.0426 16.1049 41.6664 15.8089L21.5417 0.181926C21.3799 0.0600527 21.1903 0 21 0ZM29.7498 3.4379V4.35263L34.9998 8.42642V3.4379H29.7498Z"
                                fill="#4C4C4C"
                              />
                            </svg>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-[#484848]">
                              Адрес
                            </p>
                            <p className="flex-grow-0 flex-shrink-0 text-base font-semibold text-left text-black">
                              {details.address || 'Не указан'}
                            </p>
                          </div>
                        </div>

                        {/* Название и описание компании */}
                        <div className="flex flex-col justify-start items-center w-[425px] absolute left-[406.5px] top-[31px] gap-[30px]">
                          <p className="self-stretch flex-grow-0 flex-shrink-0 w-[425px] text-[28px] font-semibold text-center text-black">
                            {details.name || company.name || 'Без названия'}
                          </p>
                          <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[427px] relative gap-2.5 px-[30px] py-[27px] rounded-[30px] bg-[#f2f2f2] overflow-y-auto">
                            <p className="self-stretch flex-grow-0 flex-shrink-0 w-[365px] text-sm text-left text-black whitespace-pre-wrap">
                              {details.description || 'Описание отсутствует'}
                            </p>
                          </div>
                        </div>

                        {/* Кнопка редактирования */}
                        <div className="flex justify-center items-center w-10 h-10 absolute left-[801.5px] top-[483px] gap-2.5 p-3 rounded-[26px] bg-[#ff9e00] cursor-pointer hover:bg-[#ef6c1a] transition-colors">
                          <svg
                            width={22}
                            height={22}
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="flex-grow-0 flex-shrink-0"
                            preserveAspectRatio="none"
                          >
                            <path
                              fillRule="evenodd"
                              clipRule="evenodd"
                              d="M1.58576 16.7395L0.0553957 20.8204C-0.00336969 20.9775 -0.0156878 21.1481 0.0199129 21.312C0.0555136 21.4758 0.137528 21.626 0.256162 21.7445C0.374795 21.863 0.525034 21.9448 0.688934 21.9803C0.852835 22.0157 1.02347 22.0032 1.18046 21.9443L5.26028 20.4139C5.72724 20.2391 6.15136 19.9662 6.50414 19.6138L18.322 7.79615C18.322 7.79615 17.9097 6.56046 16.6751 5.32477C15.4406 4.09025 14.2037 3.67796 14.2037 3.67796L2.38589 15.4956C2.03348 15.8484 1.76066 16.2725 1.58576 16.7395ZM15.8517 2.02999L17.4625 0.419279C17.7513 0.130446 18.1368 -0.053568 18.5398 0.0139815C19.107 0.107153 19.9746 0.388998 20.7922 1.20774C21.611 2.02649 21.8928 2.89299 21.986 3.46017C22.0536 3.86314 21.8696 4.24864 21.5807 4.53747L19.9688 6.14818C19.9688 6.14818 19.5577 4.91365 18.322 3.67913C17.0874 2.44227 15.8517 2.02999 15.8517 2.02999Z"
                              fill="white"
                            />
                          </svg>
                        </div>

                        {/* Кнопка "Перейти к объявлениям" */}
                        <div className="flex justify-center items-start w-[200px] absolute left-[34.5px] top-[462px] gap-4 px-6 py-4 rounded-2xl cursor-pointer hover:opacity-90 transition">
                          <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#ff9e00]">
                            Перейти к объявлениям
                          </p>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full text-red-600">
                        Не удалось загрузить детали компании
                      </div>
                    )}
                  </div>
                ) : (
                  <div
                    className="flex justify-between items-center w-[880px] h-[90px] px-5 rounded-[20px] bg-white shadow hover:shadow-md cursor-pointer"
                    onClick={() => toggleExpand(slug)}
                  >
                    <p className="text-xl font-semibold">{company.name || 'Без названия'}</p>
                    <svg width={21} height={11} viewBox="0 0 21 11" fill="none">
                      <path d="M1.5 1.5L10.5 9.5L19.5 1.5" stroke="#FCA311" strokeWidth={3} strokeLinecap="round" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CompanyCreateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleCompanyCreated}
      />
    </div>
  );
}
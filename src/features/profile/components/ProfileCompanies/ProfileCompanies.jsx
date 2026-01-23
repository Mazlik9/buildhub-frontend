// src/features/profile/components/ProfileCompanies/ProfileCompanies.jsx
import { useState, useEffect } from 'react';
import { companyService } from '@/api/services';
import { toast } from 'sonner';
import CompanyCreateModal from './CompanyCreateModal';

export default function ProfileCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCompanySlug, setExpandedCompanySlug] = useState(null);
  const [expandedCompanyData, setExpandedCompanyData] = useState(null);
  const [expandedLoading, setExpandedLoading] = useState(false);

  // Загрузка списка моих компаний
  useEffect(() => {
    const fetchMyCompanies = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await companyService.getMyCompanies();
        setCompanies(data.results || data); // поддержка пагинации / без неё
      } catch (err) {
        console.error('Ошибка загрузки компаний:', err);
        setError('Не удалось загрузить список компаний');
        toast.error('Ошибка загрузки компаний');
      } finally {
        setLoading(false);
      }
    };

    fetchMyCompanies();
  }, []);

  // Загрузка детальной информации о компании при развороте карточки
  useEffect(() => {
    if (!expandedCompanySlug) {
      setExpandedCompanyData(null);
      return;
    }

    const fetchCompanyDetails = async () => {
      setExpandedLoading(true);
      try {
        const data = await companyService.getBySlug(expandedCompanySlug);
        setExpandedCompanyData(data);
      } catch (err) {
        console.error('Ошибка загрузки компании:', err);
        toast.error('Не удалось загрузить информацию о компании');
      } finally {
        setExpandedLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [expandedCompanySlug]);

  const handleCompanyCreated = () => {
    setIsModalOpen(false);
    // Перезагружаем список компаний после создания
    window.location.reload(); // можно заменить на отдельный fetchMyCompanies()
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 animate-pulse">
        <div className="h-10 w-64 bg-gray-200 rounded mb-8" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-[90px] bg-gray-200 rounded-[20px]" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <p className="text-red-600 text-xl mb-4">{error}</p>
        <button
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-orange-500 text-white rounded-xl hover:opacity-90"
        >
          Попробовать снова
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Мои компании</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="px-6 py-3 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-xl hover:opacity-90 transition"
        >
          + Добавить компанию
        </button>
      </div>

      {companies.length === 0 ? (
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef6c1a" strokeWidth="2">
              <path d="M3 21V8a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v13" />
              <path d="M9 21V10a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v11" />
              <path d="M12 3v6" />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-800 mb-4">У вас пока нет компаний</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
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
        <div className="space-y-4">
          {companies.map((company) => (
            <CompanyCard
              key={company.slug || company.id}
              company={company}
              isExpanded={expandedCompanySlug === (company.slug || company.id)}
              onToggle={() =>
                setExpandedCompanySlug(
                  expandedCompanySlug === (company.slug || company.id) ? null : (company.slug || company.id)
                )
              }
              details={expandedCompanyData}
              detailsLoading={expandedLoading}
            />
          ))}
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

// Компонент карточки компании (с разворотом)
function CompanyCard({ company, isExpanded, onToggle, details, detailsLoading }) {
  return (
    <div className="w-full">
      {/* Основная карточка 880×90 */}
      <div
        className="flex flex-col justify-center items-center w-[880px] h-[90px] gap-2.5 px-5 py-[15px] rounded-[20px] bg-white cursor-pointer hover:shadow-md transition-shadow"
        onClick={onToggle}
      >
        <div className="flex justify-between items-center self-stretch flex-grow-0 flex-shrink-0 relative">
          <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 w-[546px] relative gap-5">
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <circle cx="30" cy="30" r="30" fill="#D9D9D9" />
            </svg>
            <p className="flex-grow-0 flex-shrink-0 text-xl font-semibold text-left text-black">
              {company.name || 'Без названия'}
            </p>
          </div>

          <svg
            width="21"
            height="11"
            viewBox="0 0 21 11"
            fill="none"
            className={`transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}
          >
            <path
              d="M1.5 1.5L10.5 9.5L19.5 1.5"
              stroke="#FCA311"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Раскрытая информация */}
      {isExpanded && (
        <div
          className="flex-grow-0 flex-shrink-0 w-[880px] h-[541px] relative overflow-hidden rounded-[30px] mt-4"
          style={{
            background: 'linear-gradient(226.41deg, #fff4e5 10.44%, #fff 98.97%)',
          }}
        >
          {detailsLoading ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : details ? (
            <>
              {/* Большой логотип */}
              <svg width="218" height="218" viewBox="0 0 218 218" fill="none" className="absolute left-[95px] top-9">
                <circle cx="109" cy="109" r="109" fill="#D9D9D9" />
              </svg>

              {/* Стрелка вверх (закрыть) */}
              <svg
                width="21"
                height="11"
                viewBox="0 0 21 11"
                fill="none"
                className="absolute left-[857.5px] top-[34.5px] cursor-pointer"
                onClick={onToggle}
              >
                <path
                  d="M19.5 9.5L10.5 1.5L1.5 9.5"
                  stroke="#FCA311"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              {/* Информация слева */}
              <div className="flex flex-col justify-center items-start absolute left-[45px] top-[284px] gap-[15px]">
                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-5">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                    {/* SVG для email — вставь свой */}
                    <path d="..." fill="#4C4C4C" />
                  </svg>
                  <p className="text-base font-semibold text-[#484848]">email: </p>
                  <p className="text-base font-semibold text-black">{details.email || '—'}</p>
                </div>

                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-5">
                  <svg width="42" height="40" viewBox="0 0 42 40" fill="none">
                    {/* SVG для телефона */}
                    <path d="..." fill="#4C4C4C" />
                  </svg>
                  <p className="text-base font-semibold text-[#484848]">Телефон </p>
                  <p className="text-base font-semibold text-black">{details.phone || '—'}</p>
                </div>

                <div className="flex justify-start items-center flex-grow-0 flex-shrink-0 relative gap-5">
                  <svg width="42" height="42" viewBox="0 0 42 42" fill="none">
                    {/* SVG для адреса */}
                    <path d="..." fill="#4C4C4C" />
                  </svg>
                  <p className="text-base font-semibold text-[#484848]">Адрес </p>
                  <p className="text-base font-semibold text-black">{details.address || '—'}</p>
                </div>
              </div>

              {/* Название и описание справа */}
              <div className="flex flex-col justify-center items-center w-[425px] absolute left-[406.5px] top-[31px] gap-[30px]">
                <p className="self-stretch flex-grow-0 flex-shrink-0 w-[425px] text-[28px] font-semibold text-center text-black">
                  {details.name || company.name}
                </p>
                <div className="flex flex-col justify-start items-start self-stretch flex-grow-0 flex-shrink-0 h-[427px] relative gap-2.5 px-[30px] py-[27px] rounded-[30px] bg-[#f2f2f2]">
                  <p className="self-stretch flex-grow-0 flex-shrink-0 w-[365px] h-[373px] text-sm text-left text-black overflow-y-auto">
                    {details.description || 'Описание отсутствует'}
                  </p>
                </div>
              </div>

              {/* Кнопки внизу */}
              <div className="flex justify-center items-start w-[200px] absolute left-[34.5px] top-[462px] gap-4 px-6 py-4 rounded-2xl">
                <p className="flex-grow-0 flex-shrink-0 text-sm text-left text-[#ff9e00]">Перейти к объявлениям</p>
              </div>

              <div className="flex justify-center items-center w-10 h-10 absolute left-[801.5px] top-[483px] gap-2.5 p-3 rounded-[26px] bg-[#ff9e00]">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                  <path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M2.01824 21.3048L0.0705036 26.4987C-0.00428869 26.6986 -0.0199663 26.9158 0.0253437 27.1243C0.0706537 27.3329 0.175036 27.524 0.326024 27.6748C0.477012 27.8256 0.668225 27.9298 0.876825 27.9749C1.08543 28.02 1.3026 28.0041 1.5024 27.9291L6.6949 25.9814C7.28922 25.7588 7.82901 25.4116 8.278 24.9631L23.3189 9.92238C23.3189 9.92238 22.7942 8.34968 21.2229 6.77698C19.6517 5.20577 18.0775 4.68104 18.0775 4.68104L3.03658 19.7217C2.58806 20.1707 2.24084 20.7105 2.01824 21.3048ZM20.1749 2.58362L22.225 0.533628C22.5926 0.166023 23.0832 -0.0681775 23.5961 0.0177947C24.318 0.136377 25.4223 0.495088 26.4628 1.53713C27.5049 2.57917 27.8636 3.68199 27.9822 4.40386C28.0682 4.91672 27.834 5.40736 27.4664 5.77496L25.4149 7.82495C25.4149 7.82495 24.8916 6.25374 23.3189 4.68252C21.7477 3.10834 20.1749 2.58362 20.1749 2.58362Z"
                    fill="white"
                  />
                </svg>
              </div>
            </>
          ) : (
            <div className="absolute inset-0 flex items-center justify-center text-red-600">
              Не удалось загрузить детали компании
            </div>
          )}
        </div>
      )}
    </div>
  );
}
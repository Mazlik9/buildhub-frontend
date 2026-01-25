// src/features/profile/components/ProfileCompanies/ProfileCompanies.jsx
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { apiServices } from '@/api/services'; // ✅ импорт напрямую из services.js
import CompanyCreateModal from './CompanyCreateModal';

export default function ProfileCompanies() {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [expandedCompanyId, setExpandedCompanyId] = useState(null);
  const [expandedDetails, setExpandedDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState({});

  // Загрузка списка компаний
  const fetchCompanies = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiServices.companies.getMyCompanies(); // ✅ правильно: companies
      setCompanies(data.results || data);
    } catch (err) {
      console.error('Ошибка загрузки компаний:', err);
      setError('Не удалось загрузить список компаний');
      toast.error('Ошибка загрузки компаний');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Загрузка деталей компании
  const fetchCompanyDetails = async (companyId) => {
    if (expandedDetails[companyId]) return;
    setDetailsLoading((prev) => ({ ...prev, [companyId]: true }));
    try {
      const data = await apiServices.companies.getCompanyBySlug(companyId); // ✅ правильно: companies
      setExpandedDetails((prev) => ({ ...prev, [companyId]: data }));
    } catch (err) {
      console.error('Ошибка загрузки деталей:', err);
      toast.error('Не удалось загрузить информацию о компании');
    } finally {
      setDetailsLoading((prev) => ({ ...prev, [companyId]: false }));
    }
  };

  const toggleExpand = (companyId) => {
    if (expandedCompanyId === companyId) {
      setExpandedCompanyId(null);
    } else {
      setExpandedCompanyId(companyId);
      fetchCompanyDetails(companyId);
    }
  };

  const handleCompanyCreated = () => {
    setIsModalOpen(false);
    fetchCompanies();
  };

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

  return (
    <div
      className={`flex flex-col w-[1200px] h-[1000px] overflow-y-auto gap-[60px] px-40 py-10 rounded-[30px] bg-[#ebebeb] ${
        companies.length === 0 ? 'items-center justify-center' : ''
      }`}
      style={{ boxShadow: "0px 5px 14px rgba(0,0,0,0.25)" }}
    >
      {/* Заголовок и кнопка */}
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
            const companyId = company.slug || company.id;
            const isExpanded = expandedCompanyId === companyId;
            const details = expandedDetails[companyId];
            const isDetailsLoading = detailsLoading[companyId];

            return (
              <div key={companyId}>
                {isExpanded ? (
                  <div className="relative w-[880px] h-[541px] rounded-[30px] overflow-hidden shadow-xl"
                       style={{ background: 'linear-gradient(226.41deg, #fff4e5 10.44%, #fff 98.97%)' }}>
                    {isDetailsLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="w-12 h-12 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
                      </div>
                    ) : details ? (
                      <>
                        <div className="absolute left-[95px] top-9 w-[218px] h-[218px] bg-gray-300 rounded-full" />

                        <div className="flex flex-col absolute left-[45px] top-[284px] gap-4">
                          <p>Email: {details.email || '—'}</p>
                          <p>Телефон: {details.phone || '—'}</p>
                          <p>Адрес: {details.address || '—'}</p>
                        </div>

                        <div className="absolute left-[406px] top-[31px] w-[425px] flex flex-col items-center gap-4">
                          <p className="text-[28px] font-semibold text-center">{details.name || company.name}</p>
                          <div className="w-full h-[427px] p-4 rounded-[30px] bg-[#f2f2f2] overflow-y-auto">
                            <p>{details.description || 'Описание отсутствует'}</p>
                          </div>
                        </div>

                        <svg
                          onClick={() => toggleExpand(companyId)}
                          className="absolute right-6 top-6 w-6 h-6 cursor-pointer"
                          viewBox="0 0 24 24"
                          stroke="#FCA311"
                          fill="none"
                        >
                          <path d="M6 18L18 6M6 6l12 12" strokeWidth="2" />
                        </svg>
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
                    onClick={() => toggleExpand(companyId)}
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

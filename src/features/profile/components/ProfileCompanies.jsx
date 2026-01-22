// src/features/profile/components/ProfileCompanies.jsx
export default function ProfileCompanies() {
  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Мои компании</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-xl hover:opacity-90 transition">
          + Добавить компанию
        </button>
      </div>

      {/* Заглушка: список пуст */}
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
        <button className="px-8 py-4 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition">
          Создать компанию
        </button>
      </div>
    </div>
  );
}
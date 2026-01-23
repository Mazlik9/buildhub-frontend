// src/features/profile/components/ProfileAds.jsx
export default function ProfileAds() {
  return (
    <div className="bg-white rounded-2xl shadow p-8">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Мои объявления</h2>
        <button className="px-6 py-3 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-xl hover:opacity-90 transition">
          + Добавить объявление
        </button>
      </div>

      {/* Заглушка: список пуст */}
      <div className="text-center py-16">
        <div className="mx-auto w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ef6c1a" strokeWidth="2">
            <path d="M21 15.5V8.5C21 7.4 20.1 6.5 19 6.5H5C3.9 6.5 3 7.4 3 8.5V15.5C3 16.6 3.9 17.5 5 17.5H19C20.1 17.5 21 16.6 21 15.5Z" />
            <path d="M12 10.5V13.5" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-800 mb-4">У вас пока нет объявлений</h3>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Создайте своё первое объявление о продаже или покупке стройматериалов прямо сейчас!
        </p>
        <button className="px-8 py-4 bg-gradient-to-r from-[#fca311] to-[#ef6c1a] text-white font-bold rounded-2xl shadow-lg hover:opacity-90 transition">
          Создать объявление
        </button>
      </div>
    </div>
  );
}
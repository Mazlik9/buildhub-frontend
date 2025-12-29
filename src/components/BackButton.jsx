// src/components/BackButton.jsx
import { useNavigate } from "react-router-dom";

export function BackButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(-1)}  // Возврат на предыдущую страницу
      className="fixed top-6 left-6 z-50 w-14 h-14 bg-white dark:bg-gray-800 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-all duration-300"
      aria-label="Назад"
    >
      <svg
        className="w-8 h-8 text-gray-700 dark:text-gray-300"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
      </svg>
    </button>
  );
}
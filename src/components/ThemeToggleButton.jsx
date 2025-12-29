// src/components/ThemeToggleButton.jsx
import { useTheme } from "../context/ThemeContext";

export function ThemeToggleButton() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="p-3 rounded-full bg-gray-700 dark:bg-orange-200/50 hover:bg-orange-200 dark:hover:bg-gray-600 transition-all duration-300"
      aria-label="Переключить тему"
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}
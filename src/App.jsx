// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import { Profile } from "./pages/Profile"; // если уже есть

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />           // ← Теперь по / открывается Main
      <Route path="/main" element={<Main />} />       // ← Оставляем для совместимости
      <Route path="/profile" element={<Profile />} /> // если есть
      {/* Другие роуты позже */}
    </Routes>
  );
}
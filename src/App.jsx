// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Main } from "./pages/Main";
import { Profile } from "./pages/Profile";
import { MyCompanies } from "./pages/MyCompanies"; // ← Новый импорт

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-companies" element={<MyCompanies />} /> {/* ← Новый роут */}
      {/* Другие роуты */}
    </Routes>
  );
}
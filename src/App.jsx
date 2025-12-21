// src/App.jsx
import { Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";      // старая лендинг-страница (до входа)
import { Main } from "./pages/Main";      // новая главная после входа

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/main" element={<Main />}/> 
      {/* Позже добавим /catalog, /services и т.д. */}
    </Routes>
  );
}
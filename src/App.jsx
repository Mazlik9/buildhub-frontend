// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import ProfilePage from '@/features/profile/ProfilePage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Главная страница открывается по адресу "/" */}
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<ProfilePage />} />

        {/* Примеры будущих маршрутов */}
        {/* <Route path="/login" element={<Login />} /> */}
        {/* <Route path="/ads" element={<AdsList />} /> */}
        {/* <Route path="/ads/:id" element={<AdDetail />} /> */}

        {/* Если кто-то зашёл по несуществующему адресу */}
        {/* <Route path="*" element={<NotFound />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
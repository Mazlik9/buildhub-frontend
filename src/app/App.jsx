// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from '@/shared/layout/Header';
import { AuthProvider } from '@/features/auth/AuthProvider';
import Home from '@/pages/Home';
import ProfilePage from '@/pages/ProfilePage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// src/App.jsx
import { AuthProvider } from '@/features/auth/AuthProvider';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import ProfilePage from '../pages/ProfilePage';
import Header from '@/shared/layout/Header';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Header /> 
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;

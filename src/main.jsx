// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';
import { Toaster } from 'sonner';  // ← добавляем компонент для уведомлений

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
    <Toaster 
      position="top-right"     // можно изменить на "top-center", "bottom-right" и т.д.
      richColors               // делает уведомления более стильными и цветными
      closeButton              // добавляет крестик для закрытия
      toastOptions={{
        duration: 4000,        // время показа в миллисекундах
        style: {
          borderRadius: '12px',
          background: '#333',
          color: '#fff',
        },
      }}
    />
  </React.StrictMode>,
);
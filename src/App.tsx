import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import React from 'react'; 

// Важно: Notifications должен быть импортирован из @mantine/notifications
import { Notifications } from '@mantine/notifications'; 
// А MantineProvider из @mantine/core
import { MantineProvider } from '@mantine/core'; 

// !!! ЭТИ ИМПОРТЫ CSS-ФАЙЛОВ ТЕПЕРЬ АБСОЛЮТНО КРИТИЧНЫ И ОБЯЗАТЕЛЬНЫ !!!
// Для Mantine V7 их нужно импортировать в корневом файле (main.tsx или App.tsx)
import '@mantine/core/styles.css';         // Базовые стили Mantine
import '@mantine/notifications/styles.css'; // Стили для уведомлений

// Импорт страниц
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

function App() {
  const isAuthenticated = localStorage.getItem('authToken');

  return (
    // Оборачиваем всё приложение в MantineProvider.
    // Пропсы withGlobalStyles и withNormalizeCSS УДАЛЕНЫ!
    <MantineProvider 
      theme={{
        // Здесь можно настроить свою Mantine тему, если нужно. Например, основной цвет:
        // primaryColor: 'blue', 
        // Если ты использовал ColorScheme (темная/светлая тема), то теперь нужно использовать `useMantineColorScheme` из `@mantine/core`
        // и передавать `colorScheme` в `theme` напрямую, а не через `ColorSchemeProvider`.
        // Например: colorScheme: 'dark',
      }}
    >
      {/* Notifications компонент должен быть внутри MantineProvider */}
      <Notifications />

      <Router>
        <Routes>
          <Route 
            path="/" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} 
          />
          <Route path="/login" element={<WelcomePage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route 
            path="/dashboard" 
            element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
          />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
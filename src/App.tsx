import React from 'react'; // React теперь нужен как переменная для JSX
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Notifications } from '@mantine/notifications';
import { MantineProvider, Center, Loader } from '@mantine/core'; // Добавляем Center и Loader для начальной загрузки Mantine
import '@mantine/core/styles.css';         // Базовые стили Mantine
import '@mantine/notifications/styles.css'; // Стили для уведомлений Mantine

// ==========================================================
// !!! НОВЫЕ ИМПОРТЫ ДЛЯ AUTH CONTEXT !!!
// ==========================================================
import { AuthProvider, useAuth } from './context/AuthContext'; // <--- Импортируем провайдер и хук

// Импорт всех страниц
import WelcomePage from './pages/WelcomePage';
import DashboardPage from './pages/DashboardPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';

// ==========================================================
// ДОЧЕРНИЙ КОМПОНЕНТ APPCONTENT
// ВЫНЕСЕН ОТДЕЛЬНО, ЧТОБЫ ИСПОЛЬЗОВАТЬ useAuth()
// ==========================================================
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth(); // <--- Используем хук useAuth() из контекста

  // Если состояние аутентификации ещё проверяется, показываем лоадер
  if (isLoading) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" /> {/* Красивый лоадер от Mantine */}
      </Center>
    );
  }

  // После загрузки, настраиваем маршруты
  return (
    <Router>
      <Routes>
        {/* Маршрут по умолчанию: если авторизован -> дашборд, иначе -> логин */}
        <Route
          path="/"
          element={isAuthenticated ? <Navigate to="/dashboard" /> : <Navigate to="/login" />}
        />
        {/* Страница логина */}
        <Route path="/login" element={<WelcomePage />} />
        {/* Страницы восстановления пароля */}
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        {/* Маршрут дашборда: доступен только авторизованным */}
        <Route
          path="/dashboard"
          element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />}
        />
        {/* Опционально: Маршрут для 404 страницы (любые другие пути) */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    </Router>
  );
};

// ==========================================================
// ГЛАВНЫЙ КОМПОНЕНТ APP
// Оборачивает приложение в провайдеры (Mantine и Auth)
// ==========================================================
function App() {
  return (
    <MantineProvider
      // Здесь можно настроить свою Mantine тему
      theme={{
        // Например: primaryColor: 'blue',
      }}
    >
      {/* Notifications компонент должен быть внутри MantineProvider */}
      <Notifications />

      {/* !!! Оборачиваем нашу AppContent в AuthProvider !!! */}
      <AuthProvider>
        <AppContent /> {/* Теперь AppContent имеет доступ к контексту аутентификации */}
      </AuthProvider>
    </MantineProvider>
  );
}

export default App;
import React from 'react'; // React теперь нужен как переменная для JSX
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'; // <--- ДОБАВЛЕН useNavigate
import { Notifications } from '@mantine/notifications';
import { MantineProvider, Center, Loader, Box, Title, Button } from '@mantine/core'; // <--- ДОБАВЛЯЕМ Box
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
import UserManagementPage from './pages/UserManagementPage'; // <-- НОВЫЙ ИМПОРТ

// ==========================================================
// ДОЧЕРНИЙ КОМПОНЕНТ APPCONTENT
// ВЫНЕСЕН ОТДЕЛЬНО, ЧТОБЫ ИСПОЛЬЗОВАТЬ useAuth()
// ==========================================================
const AppContent: React.FC = () => {
  const { isAuthenticated, isLoadingAuth } = useAuth(); // <--- Используем хук useAuth() из контекста
  const navigate = useNavigate(); // <-- useNavigate тоже нужен здесь для 404, если будешь его рендерить

  // Если состояние аутентификации ещё проверяется, показываем лоадер
  if (isLoadingAuth) {
    return (
      <Center style={{ height: '100vh' }}>
        <Loader size="xl" /> {/* Красивый лоадер от Mantine */}
      </Center>
    );
  }

  // После загрузки, настраиваем маршруты
  return (
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

 {/* --- ГЛАВНОЕ: НОВЫЙ МАРШРУТ УПРАВЛЕНИЯ ПОЛЬЗОВАТЕЛЯМИ --- */}
      {/* Используем логику защиты маршрута, как в других местах */}
      <Route
        path="/admin/users" // <- Путь, который ты задал в linkTo у карточки
        element={isAuthenticated ? <UserManagementPage /> : <Navigate to="/login" />}
      />

      {/* Опционально: Маршрут для 404 страницы (любые другие пути) */}
      <Route path="*" element={
        <Center style={{ height: '100vh', flexDirection: 'column' }}> {/* Стили для 404 */}
          <Title order={1} mb="md">404 - Страница не найдена</Title>
          <Button onClick={() => navigate('/')} mt="md">На главную</Button>
        </Center>
      } />
    </Routes>
  );
};

// ==========================================================
// ГЛАВНЫЙ КОМПОНЕНТ APP
// Оборачивает приложение в провайдеры (Mantine и Auth) и добавляет глобальный фон
// ==========================================================
function App() {
  const backgroundImage = 'url(https://plus.unsplash.com/premium_photo-1744984305460-a16e58cf20a8?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1yZWxhdGVkfDU3fHx8ZW58MHx8fHx8)';

  return (
    <BrowserRouter>
    <MantineProvider
      // Здесь можно настроить свою Mantine тему
      theme={{
        // Например: primaryColor: 'blue',
      }}
    >
      {/* Notifications компонент должен быть внутри MantineProvider */}
      <Notifications />

      {/* Оборачиваем все приложение в Box с глобальным фоном */}
      <Box
        style={{
          minHeight: '100vh', // Фон должен занимать всю высоту окна
          minWidth: '100vw',  // Фон должен занимать всю ширину окна
          backgroundImage: backgroundImage,
          backgroundSize: 'cover',        // Растянуть изображение, чтобы покрыть всю область
          backgroundPosition: 'center',   // Центрировать изображение
          backgroundRepeat: 'no-repeat',  // Не повторять изображение
        }}
      >
        <AuthProvider>
          <AppContent /> {/* Теперь AppContent (со всем роутингом) отрисовывается на фоне */}
        </AuthProvider>
      </Box>
    </MantineProvider>
    </BrowserRouter>
  );
}
export default App;
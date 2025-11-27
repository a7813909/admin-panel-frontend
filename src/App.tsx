 import '@mantine/core/styles.css';
    import '@mantine/notifications/styles.css';

    import { MantineProvider } from '@mantine/core';
    import { Notifications } from '@mantine/notifications';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';

    import WelcomePage from './pages/WelcomePage'; // Наша страница регистрации
    import LoginPage from './pages/LoginPage';     // Страница логина

    function App() {
      return (
        <BrowserRouter> {/* Обязателен для работы роутинга и useNavigate */}
          <MantineProvider> {/* Пропсы withGlobalStyles и withNormalizeCSS удалены */}
            <Notifications /> {/* Provider для Mantine-уведомлений */}
            <Routes>
              {/* Роут для страницы регистрации */}
              <Route path="/" element={<WelcomePage />} />
              <Route path="/register" element={<WelcomePage />} />
              {/* Роут для страницы логина */}
              <Route path="/login" element={<LoginPage />} />
              {/* Опционально: роут для 404 страницы */}
              <Route path="*" element={<div>404: Страница не найдена</div>} />
            </Routes>
          </MantineProvider>
        </BrowserRouter>
      );
    }

    export default App;
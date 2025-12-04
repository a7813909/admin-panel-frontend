import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
// Импортируем интерфейс User
// Путь может отличаться, если User определен в отдельном файле
import { type User } from '../pages/DashboardPage'; // Или '../types/User' если есть общий файл типов

interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null; // <-- ДОБАВЛЕНО: Объект текущего пользователя
  setUser: (user: User | null) => void; // <-- ДОБАВЛЕНО: Функция для установки пользователя
  isLoadingAuth: boolean; // <-- ИЗМЕНЕНО: Более явное название
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null); // <-- ДОБАВЛЕНО: Состояние для пользователя
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true); // <-- ИЗМЕНЕНО: Название

  useEffect(() => {
    const initializeAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('loggedInUser'); // Пытаемся получить пользователя

      if (authToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(parsedUser); // Устанавливаем пользователя при инициализации
        } catch (e) {
          console.error("AuthContext: Ошибка при парсинге данных пользователя из localStorage", e);
          // Если данные битые, очищаем все и сбрасываем авторизацию
          localStorage.removeItem('authToken');
          localStorage.removeItem('loggedInUser');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        // Если нет токена ИЛИ данных пользователя, считаем неавторизованным
        setIsAuthenticated(false);
        setUser(null);
        // Не удаляем `authToken` здесь, чтобы `DashboardPage` мог решить,
        // нужно ли делать logout, если `authToken` есть, но `loggedInUser` нет.
      }
      setIsLoadingAuth(false); // Загрузка инициализации контекста завершена
    };

    initializeAuth();
  }, []); // Пустой массив зависимостей: выполнится только один раз при монтировании

  // ЕслиisLoadingAuth TRUE, имеет смысл блокировать рендер всего приложения
  // или показать глобальный лоадер во время инициализации контекста.
  if (isLoadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#ccc' }}>
        Запуск приложения...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
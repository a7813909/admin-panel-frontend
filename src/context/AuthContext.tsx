import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { type User } from '../types/user'; // Импортируем интерфейс User


interface AuthContextType {
  isAuthenticated: boolean;
  setIsAuthenticated: (value: boolean) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isLoadingAuth: boolean; // Статус инициализации контекста
  // isServerWakingUp (удалено)
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState<boolean>(true);
  // isServerWakingUp удалено полностью (включая useState)

  // --- 1. Логика инициализации авторизации (проверка токена) ---
  // Вся логика теперь в одном useEffect, который запускается сразу.
  useEffect(() => {
    // Эта логика будет выполняться сразу при монтировании компонента.
    const initializeAuth = () => {
      const authToken = localStorage.getItem('authToken');
      const storedUser = localStorage.getItem('loggedInUser');

      if (authToken && storedUser) {
        try {
          const parsedUser: User = JSON.parse(storedUser);
          setIsAuthenticated(true);
          setUser(parsedUser);
        } catch (e) {
          console.error("AuthContext: Ошибка при парсинге данных пользователя из localStorage", e);
          localStorage.removeItem('authToken');
          localStorage.removeItem('loggedInUser');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoadingAuth(false); // Загрузка инициализации контекста завершена
    };

    initializeAuth(); // Запускаем проверку сразу
  }, []); // Пустой массив зависимостей: запускается один раз при монтировании

  // --- 2. Условный рендеринг: Лоадер ---
  // Теперь этот лоадер виден только во время проверки localStorage.
  if (isLoadingAuth) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', fontSize: '20px', color: '#ccc' }}>
        Загрузка аутентификации...
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser, isLoadingAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

// --- Custom Hook для удобства использования контекста ---
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
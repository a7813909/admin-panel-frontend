import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

    interface AuthContextType {
      isAuthenticated: boolean;
      setIsAuthenticated: (value: boolean) => void;
      isLoading: boolean;
    }

    const AuthContext = createContext<AuthContextType | undefined>(undefined);

    interface AuthProviderProps {
      children: ReactNode;
    }

    export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
      const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
      const [isLoading, setIsLoading] = useState<boolean>(true);

      useEffect(() => {
        const token = localStorage.getItem('authToken');
        setIsAuthenticated(!!token);
        setIsLoading(false);
      }, []);

      return (
        <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated, isLoading }}>
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
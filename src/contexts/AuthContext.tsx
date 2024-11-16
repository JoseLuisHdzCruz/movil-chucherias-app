// AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

interface User {
  customerId: number | null;
  nombre: string;
  aPaterno: string;
  aMaterno: string;
  sexo: string;
  correo: string;
  imagen: string;
  edad: Date;
  telefono: string;
  respuestaPSecreta: string;
  preguntaSecreta: string;
  sesion: string;
}

interface AuthContextType {
  user: User | null;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode; value?: AuthContextType }> = ({ children, value }) => {
  const [user, setUser] = useState<User | null>(value?.user || null);

  useEffect(() => {
    if (!value) {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded: User = jwtDecode(token);
        setUser(decoded);
      }
    }
  }, [value]);

  const login = (token: string) => {
    localStorage.setItem('token', token);
    const decoded: User = jwtDecode(token);
    setUser(decoded);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
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

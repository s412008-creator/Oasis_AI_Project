"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  isLoggedIn: boolean;
  userName: string | null;
  login: (name: string) => void;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedAuth = localStorage.getItem('oasis_auth_state');
    if (storedAuth) {
      try {
        const parsed = JSON.parse(storedAuth);
        if (parsed.isLoggedIn) {
          setIsLoggedIn(true);
          setUserName(parsed.userName);
        }
      } catch (e) {
        console.error("Failed to parse auth state");
      }
    }
    setIsLoading(false);
  }, []);

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUserName(name);
    localStorage.setItem('oasis_auth_state', JSON.stringify({ isLoggedIn: true, userName: name }));
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUserName(null);
    localStorage.removeItem('oasis_auth_state');
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, userName, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

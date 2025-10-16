import React, { createContext, useState, ReactNode } from 'react';

interface AppContextType {
  isOnboardingComplete: boolean;
  setOnboardingComplete: (value: boolean) => void;
  currentTheme: 'light' | 'dark';
  toggleTheme: () => void;
}

export const AppContext = createContext<AppContextType | undefined>(undefined);

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [isOnboardingComplete, setIsOnboardingComplete] = useState(false);
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark'>('dark');

  const setOnboardingComplete = (value: boolean) => {
    setIsOnboardingComplete(value);
  };

  const toggleTheme = () => {
    setCurrentTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const value = {
    isOnboardingComplete,
    setOnboardingComplete,
    currentTheme,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

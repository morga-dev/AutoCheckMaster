import React, { createContext, useContext, useState, useEffect } from "react";

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const ConfiguracionContexto = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('generalSettings');
    return saved ? JSON.parse(saved) : {
      darkMode: false,
      notifications: true,
      language: 'es',
      theme: 'purple'
    };
  });

  useEffect(() => {
    localStorage.setItem('generalSettings', JSON.stringify(settings));
  }, [settings]);

  return (
    <SettingsContext.Provider value={{ settings, setSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};
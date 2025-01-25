"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type SiteSettings = {
  darkMode: boolean;
};

type SiteContextType = {
  settings: SiteSettings;
  updateSetting: <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => void;
};

const defaultSettings: SiteSettings = {
  darkMode: false,
};

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
});

export function SiteProvider({
  children,
  initialSettings,
}: {
  children: React.ReactNode;
  initialSettings: SiteSettings;
}) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);

  const updateSetting = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    document.cookie = `${key}=${value}; path=/; max-age=31536000`; // Update cookie

    if (key === "darkMode") {
      if (value) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  return (
    <SiteContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SiteContext.Provider>
  );
}

export function useSiteSettings() {
  const context = useContext(SiteContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteProvider");
  }
  return context;
}

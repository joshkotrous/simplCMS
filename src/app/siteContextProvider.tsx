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
  darkMode: false, // Default value, will be updated in useEffect
};

const SiteContext = createContext<SiteContextType>({
  settings: defaultSettings,
  updateSetting: () => {},
});

export function SiteProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [mounted, setMounted] = useState(false);

  // Initialize on mount
  useEffect(() => {
    const saved = localStorage.getItem("siteSettings");
    const savedSettings = saved ? JSON.parse(saved) : null;
    const systemDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;

    setSettings(savedSettings || { darkMode: systemDark });
    setMounted(true);
  }, []);

  // Update HTML class when dark mode changes
  useEffect(() => {
    if (mounted) {
      localStorage.setItem("siteSettings", JSON.stringify(settings));
      if (settings.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [settings, mounted]);

  const updateSetting = <K extends keyof SiteSettings>(
    key: K,
    value: SiteSettings[K]
  ) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  // Avoid hydration mismatch
  if (!mounted) return <>{children}</>;

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

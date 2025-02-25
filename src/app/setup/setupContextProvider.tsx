"use client";
import {
  SimplCMSPlatformConfiguration,
  simplCMSPlatformConfigurationObject,
} from "@/types/types";
import React, { createContext, useContext, useEffect, useState } from "react";

const SETUP_DATA_KEY = "setupData";

const defaultSetupData: SimplCMSPlatformConfiguration = {
  host: null,
  database: null,
  mediaStorage: null,
  oauth: null,
};

export const SetupContext = createContext<{
  setupData: SimplCMSPlatformConfiguration;
  setSetupData: React.Dispatch<
    React.SetStateAction<SimplCMSPlatformConfiguration>
  >;
  isInitialized: boolean;
}>({
  setupData: defaultSetupData,
  setSetupData: () => {},
  isInitialized: false,
});

function getDataFromLocalStorage(): SimplCMSPlatformConfiguration | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const localValue = localStorage.getItem(SETUP_DATA_KEY);
    if (localValue) {
      return simplCMSPlatformConfigurationObject.parse(JSON.parse(localValue));
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  return null;
}

export function SetupProvider({ children }: { children: React.ReactNode }) {
  const [setupData, setSetupData] =
    useState<SimplCMSPlatformConfiguration>(defaultSetupData);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const storedData = getDataFromLocalStorage();
    if (storedData) {
      setSetupData(storedData);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized && typeof window !== "undefined") {
      localStorage.setItem(SETUP_DATA_KEY, JSON.stringify(setupData));
    }
  }, [setupData, isInitialized]);

  const value = { setupData, setSetupData, isInitialized };

  return (
    <SetupContext.Provider value={value}>{children}</SetupContext.Provider>
  );
}

export function useSetupData() {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetup must be used within SetupProvider");
  }
  return context;
}

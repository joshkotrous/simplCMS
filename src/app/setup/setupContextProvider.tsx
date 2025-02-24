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
}>({
  setupData: defaultSetupData,
  setSetupData: () => {},
});

function getDefaultSetupData() {
  const localValue = localStorage.getItem(SETUP_DATA_KEY);
  if (localValue) {
    return simplCMSPlatformConfigurationObject.parse(JSON.parse(localValue));
  } else {
    return defaultSetupData;
  }
}

export function SetupProvider({ children }: { children: React.ReactNode }) {
  const [setupData, setSetupData] = useState<SimplCMSPlatformConfiguration>(
    getDefaultSetupData()
  );
  const value = { setupData, setSetupData };

  useEffect(() => {
    localStorage.setItem(SETUP_DATA_KEY, JSON.stringify(setupData));
  }, [setupData]);

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

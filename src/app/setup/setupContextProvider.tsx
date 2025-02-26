"use client";

import { SimplCMSPlatformConfiguration } from "@/types/types";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useRef,
} from "react";

const SETUP_DATA_KEY = "setupData";

const defaultSetupData: SimplCMSPlatformConfiguration = {
  host: null,
  database: null,
  mediaStorage: null,
  oauth: null,
};

// Create a more explicit interface for the context
interface SetupContextType {
  setupData: SimplCMSPlatformConfiguration;
  setSetupData: React.Dispatch<
    React.SetStateAction<SimplCMSPlatformConfiguration>
  >;
  isInitialized: boolean;
}

// Default context with proper typing
const defaultContextValue: SetupContextType = {
  setupData: defaultSetupData, // Start with default data
  setSetupData: () => {},
  isInitialized: false,
};

export const SetupContext =
  createContext<SetupContextType>(defaultContextValue);

function getDataFromLocalStorage(): SimplCMSPlatformConfiguration | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const localValue = localStorage.getItem(SETUP_DATA_KEY);
    if (localValue) {
      // Validate JSON structure before returning
      const parsedData = JSON.parse(localValue);
      return parsedData;
    }
  } catch (error) {
    console.error("Error reading from localStorage:", error);
  }

  return null;
}

export function SetupProvider({ children }: { children: React.ReactNode }) {
  // Initialize with default data
  const [setupData, setSetupData] =
    useState<SimplCMSPlatformConfiguration>(defaultSetupData);
  const [isInitialized, setIsInitialized] = useState(false);
  const [initError, setInitError] = useState<Error | null>(null);
  const initAttempted = useRef(false);

  // Initialize data immediately on mount
  useEffect(() => {
    // Prevent multiple initialization attempts
    if (initAttempted.current) return;
    initAttempted.current = true;

    const initializeData = () => {
      try {
        // Check if we're running on server or have no window
        if (typeof window === "undefined") {
          setIsInitialized(true);
          return;
        }

        // Try to get data from localStorage
        const storedData = getDataFromLocalStorage();
        if (storedData) {
          setSetupData(storedData);
        }
      } catch (error) {
        console.error("Error in context initialization:", error);
        setInitError(error instanceof Error ? error : new Error(String(error)));
      } finally {
        // Mark as initialized immediately after attempt
        setIsInitialized(true);
      }
    };

    // Initialize immediately
    initializeData();
  }, []);

  // Save data to localStorage when it changes (but not on first render)
  // This prevents unnecessary localStorage writes
  const firstRender = useRef(true);
  useEffect(() => {
    // Skip first render
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }

    if (isInitialized && typeof window !== "undefined") {
      try {
        localStorage.setItem(SETUP_DATA_KEY, JSON.stringify(setupData));
      } catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    }
  }, [setupData, isInitialized]);

  const contextValue: SetupContextType = {
    setupData,
    setSetupData,
    isInitialized,
  };

  return (
    <SetupContext.Provider value={contextValue}>
      {children}
    </SetupContext.Provider>
  );
}

export function useSetupData(): SetupContextType {
  const context = useContext(SetupContext);
  if (!context) {
    throw new Error("useSetupData must be used within SetupProvider");
  }
  return context;
}

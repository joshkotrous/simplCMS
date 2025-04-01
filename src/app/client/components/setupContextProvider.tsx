"use client";

import { SimplCMSPlatformConfiguration } from "../../../types/types";
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

// Get a simple integrity key based on browser environment
function getIntegrityKey(): string {
  if (typeof window === "undefined") {
    return "default-key";
  }
  
  const domain = window.location.hostname;
  const appPrefix = "simplcms"; // Application-specific prefix
  return `${appPrefix}-${domain}`;
}

// Simple hash function for integrity check
function simpleHash(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash.toString(16);
}

// Protect data with obfuscation and integrity check
function protectData(data: string): string {
  const key = getIntegrityKey();
  const integrity = simpleHash(data + key);
  const payload = JSON.stringify({
    data: btoa(data),
    integrity
  });
  return `___PROTECTED___${btoa(payload)}`;
}

// Verify and extract protected data
function extractProtectedData(protectedData: string): string {
  // Check if this is protected data
  if (!protectedData.startsWith('___PROTECTED___')) {
    // For backward compatibility, return as is
    return protectedData;
  }
  
  try {
    const payload = atob(protectedData.substring('___PROTECTED___'.length));
    const { data, integrity } = JSON.parse(payload);
    const decodedData = atob(data);
    
    // Verify integrity
    const key = getIntegrityKey();
    const calculatedIntegrity = simpleHash(decodedData + key);
    
    if (calculatedIntegrity !== integrity) {
      console.error("Data integrity check failed");
      throw new Error("Data may have been tampered with");
    }
    
    return decodedData;
  } catch (error) {
    console.error("Error extracting protected data:", error);
    throw error;
  }
}

function getDataFromLocalStorage(): SimplCMSPlatformConfiguration | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = localStorage.getItem(SETUP_DATA_KEY);
    if (storedValue) {
      let jsonData;
      
      // Try to extract protected data, with fallback for backward compatibility
      try {
        jsonData = extractProtectedData(storedValue);
      } catch (error) {
        // If extraction fails, try treating it as unprotected data
        console.warn("Could not extract protected data, trying as plaintext");
        jsonData = storedValue;
      }
      
      // Validate JSON structure before returning
      const parsedData = JSON.parse(jsonData);
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
        // Protect the data before storing it
        const protectedData = protectData(JSON.stringify(setupData));
        localStorage.setItem(SETUP_DATA_KEY, protectedData);
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
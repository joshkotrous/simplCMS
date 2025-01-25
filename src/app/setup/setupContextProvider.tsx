"use client";
import { HostProvider } from "@/types/types";
import { GetProjectsProjects } from "@vercel/sdk/models/getprojectsop.js";
import { TeamLimited } from "@vercel/sdk/models/teamlimited.js";
import React, { createContext, useContext, useState } from "react";

interface SetupData {
  hostProvider: HostProvider | null;
  vercelToken: string;
  vercelTeam: TeamLimited | { [k: string]: any } | null;
  vercelProject: GetProjectsProjects | null;
}

const defaultSetupData: SetupData = {
  hostProvider: "Vercel",
  vercelToken: "",
  vercelTeam: null,
  vercelProject: null,
};

export const SetupContext = createContext<{
  setupData: SetupData;
  setSetupData: React.Dispatch<React.SetStateAction<SetupData>>;
}>({
  setupData: defaultSetupData,
  setSetupData: () => {},
});

export function SetupProvider({ children }: { children: React.ReactNode }) {
  const [setupData, setSetupData] = useState<SetupData>(defaultSetupData);
  const value = { setupData, setSetupData };

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

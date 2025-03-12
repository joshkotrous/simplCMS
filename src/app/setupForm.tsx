"use client";
import { useEffect, useState, useRef, useCallback } from "react";
import { useSetupData } from "./setup/setupContextProvider";
import { validateSetupAction } from "./actions/simplCms";
import { SetupStep, SimplCMSPlatformConfiguration } from "@/types/types";
import {
  SetupValidation,
  SetupValidationComponent,
} from "@/packages/core/src/simplCms";
import {
  ArrowUp,
  Check,
  Loader2,
  Square,
  TriangleAlert,
  RefreshCw,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SETUP_DATA_KEY = "setupData";

const setupSteps: { step: SetupStep; description: string }[] = [
  { step: "host", description: "Setup host provder" },
  { step: "database", description: "Setup database provider" },
  { step: "mediaStorage", description: "Setup media storage provider" },
  { step: "oauth", description: "Setup OAuth provider" },
  { step: "adminUser", description: "Add Admin user" },
  { step: "redeploy", description: "Redeploy" },
];

export default function SetupForm({
  serverConfiguration,
}: {
  serverConfiguration: SimplCMSPlatformConfiguration;
}) {
  // State for UI
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [configData, setConfigData] =
    useState<SimplCMSPlatformConfiguration>(serverConfiguration);
  const [currentStep, setCurrentStep] = useState<{
    complete: boolean;
    step: SetupStep;
  }>({ complete: false, step: "adminUser" });
  const [nextStep, setNextStep] = useState<{
    url: string;
    text: string;
  }>(getNextStep("adminUser"));
  const [setupValidation, setSetupValidation] =
    useState<Partial<SetupValidation> | null>(null);

  // Get setup context
  const setupContext = useSetupData();

  // Extract Vercel config helper function
  const extractVercelConfig = useCallback(
    (config: SimplCMSPlatformConfiguration) => {
      const token = config.host?.vercel?.token;
      const projectId = config.host?.vercel?.projectId;
      const teamId = config.host?.vercel?.teamId;

      if (!token || !projectId || !teamId) {
        return undefined;
      }

      return { token, projectId, teamId };
    },
    []
  );

  // Function to run validation - now a callback to prevent recreation
  const runValidation = useCallback(
    async (config: SimplCMSPlatformConfiguration) => {
      try {
        console.log("Running validation with config:", config);
        const vercelConfig = extractVercelConfig(config);

        const validation = await validateSetupAction({
          provider: config.host?.provider,
          vercelConfig,
          setupData: config,
        });

        console.log(
          "SETUP VALIDATION RESULT:",
          JSON.stringify(validation, null, 2)
        );

        if (validation) {
          const currentStep = getSetupStep(validation);
          const nextStep = getNextStep(currentStep.step);
          setCurrentStep(currentStep);
          setNextStep(nextStep);
          setSetupValidation(validation);
        }
      } catch (error) {
        console.error("Validation error:", error);
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [extractVercelConfig]
  );

  // Initialize data
  useEffect(() => {
    const initData = async () => {
      console.log("Initializing data...");
      try {
        // First try to get data from localStorage
        if (typeof window !== "undefined") {
          const rawData = localStorage.getItem(SETUP_DATA_KEY);
          if (rawData) {
            try {
              const localData = JSON.parse(rawData);
              console.log("Found data in localStorage:", localData);

              // Use localStorage data
              setConfigData(localData);

              // Also update context for consistency
              if (setupContext && setupContext.setSetupData) {
                setupContext.setSetupData(localData);
              }

              // Run validation with localStorage data
              await runValidation(localData);
              return;
            } catch (e) {
              console.error("Error parsing localStorage data:", e);
            }
          }
        }

        // If no localStorage data, use server config
        console.log("Using server configuration");
        setConfigData(serverConfiguration);
        await runValidation(serverConfiguration);
      } catch (error) {
        console.error("Error initializing:", error);
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    initData();
  }, [serverConfiguration, runValidation]);

  // Add a function to manually refresh validation
  const refreshValidation = async () => {
    setIsRefreshing(true);

    // Get the latest data from localStorage if available
    let dataToValidate = configData;
    if (typeof window !== "undefined") {
      const rawData = localStorage.getItem(SETUP_DATA_KEY);
      if (rawData) {
        try {
          const localData = JSON.parse(rawData);
          dataToValidate = localData;
          setConfigData(localData);

          // Update context
          if (setupContext && setupContext.setSetupData) {
            setupContext.setSetupData(localData);
          }
        } catch (e) {
          console.error("Error parsing localStorage data during refresh:", e);
        }
      }
    }

    await runValidation(dataToValidate);
  };

  // Helper functions for setup steps
  function getStepValidation(
    step: SetupStep,
    setupValidation: Partial<SetupValidation>
  ): SetupValidationComponent {
    const stepValidation = setupValidation[step];
    if (stepValidation === undefined) throw new Error("Invalid step");
    return stepValidation;
  }

  function checkSetupCompleted(
    setupValidation: Partial<SetupValidation>
  ): boolean {
    let setupComplete = true;
    Object.values(setupValidation).forEach((component) => {
      if (component.setupComplete === false) {
        setupComplete = false;
      }
    });
    return setupComplete;
  }

  function getSetupStep(setupValidation: Partial<SetupValidation>): {
    complete: boolean;
    step: SetupStep;
  } {
    const steps: SetupStep[] = [
      "host",
      "database",
      "mediaStorage",
      "oauth",
      "adminUser",
      "redeploy",
    ];

    const isComplete = checkSetupCompleted(setupValidation);
    const currentStep =
      steps.find((step) => !setupValidation[step]?.setupComplete) ||
      "adminUser";

    return {
      complete: isComplete,
      step: currentStep,
    };
  }

  const handleSkipMediaStorage = useCallback(async () => {
    console.log("Skip Media Storage button clicked");

    // Capture the current config for direct manipulation
    const currentConfig = { ...configData };
    currentConfig.mediaStorage = { skipped: true };

    // Update the config state and context
    setConfigData(currentConfig);

    // Update the context
    setupContext.setSetupData(currentConfig);

    // Also directly update localStorage for redundancy
    if (typeof window !== "undefined") {
      try {
        console.log(
          "Writing directly to localStorage:",
          JSON.stringify(currentConfig)
        );
        localStorage.setItem(SETUP_DATA_KEY, JSON.stringify(currentConfig));
      } catch (e) {
        console.error("Error updating localStorage:", e);
      }
    }

    // Wait a moment for state updates to propagate
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Then refresh validation to update the UI
    refreshValidation();
  }, [configData, setupContext, refreshValidation]);

  function getNextStep(step: SetupStep): { url: string; text: string } {
    switch (step) {
      case "host":
        return { url: "/setup/host", text: "Setup Host" };
      case "database":
        return { url: "/setup/database", text: "Setup Database" };
      case "mediaStorage":
        return { url: "/setup/media-storage", text: "Setup Media Storage" };
      case "oauth":
        return { url: "/setup/oauth", text: "Setup Oauth" };
      case "adminUser":
        return { url: "/setup/add-user", text: "Setup Admin User" };
      case "redeploy":
        return { url: "/setup/redeploy", text: "Redeploy" };
      default:
        throw new Error("Unsupported step");
    }
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
        <p className="text-sm text-gray-500">Validating setup...</p>
      </div>
    );
  }

  // Show error if validation failed
  if (!setupValidation) {
    return (
      <div className="text-center">
        <p className="text-lg mb-2">Unable to load setup validation.</p>
        <p className="text-sm text-gray-600 mb-4">
          This could be due to missing configuration data.
        </p>
        <div className="text-xs text-left bg-gray-100 p-3 mb-4 rounded max-w-md mx-auto">
          <p>Debug info:</p>
          <pre className="overflow-auto mt-1 p-2 bg-white rounded text-[10px]">
            {JSON.stringify(configData, null, 2)}
          </pre>
        </div>
        <Button onClick={refreshValidation} className="mt-4">
          {isRefreshing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Refreshing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Validation
            </>
          )}
        </Button>
      </div>
    );
  }

  return (
    <TooltipProvider>
      {!currentStep.complete && (
        <div className="flex flex-col items-center gap-4">
          <h2 className="text-xl text-zinc-400">
            Setup requires a few simple steps
          </h2>
          <div className="flex flex-col gap-2">
            {setupSteps.map((step) => {
              const { errors, setupComplete } = getStepValidation(
                step.step,
                setupValidation
              );
              let icon = null;
              if (!setupComplete && errors.length === 0) {
                icon = <Square className="size-4" />;
              } else if (setupComplete) {
                icon = <Check className="size-4 text-green-500" />;
              } else {
                icon = (
                  <Tooltip>
                    <TooltipTrigger>
                      <TriangleAlert className="size-4 text-yellow-500" />
                    </TooltipTrigger>
                    <TooltipContent>
                      {errors.map((error, index) => (
                        <span key={index}>
                          {error}
                          {index < errors.length - 1 ? ", " : ""}
                        </span>
                      ))}
                    </TooltipContent>
                  </Tooltip>
                );
              }
              return (
                <div key={step.step} className="flex gap-2 items-center">
                  {icon}
                  <p>{step.description}</p>
                </div>
              );
            })}
          </div>
          <Link href={nextStep.url} className="w-full">
            <Button className="w-full">
              {nextStep.text}
              <div className="rotate-90">
                <ArrowUp className="animate-bounce" />
              </div>
            </Button>
          </Link>
          {currentStep.step === "mediaStorage" && (
            <Button
              className="w-full"
              onClick={handleSkipMediaStorage}
              variant="secondary"
            >
              Skip Media Storage Setup
            </Button>
          )}
        </div>
      )}
      {currentStep.complete && (
        <div className="text-center flex flex-col gap-2">
          <span className="flex items-center gap-2 w-full justify-center text-2xl">
            <Check className="text-green-500" /> Setup Complete
          </span>
          <Link href="/admin" className="w-full">
            <Button className="w-full">
              Go to Dashboard
              <div className="rotate-90">
                <ArrowUp className="animate-bounce" />
              </div>
            </Button>
          </Link>
        </div>
      )}
    </TooltipProvider>
  );
}

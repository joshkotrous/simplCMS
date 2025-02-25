"use client";
import { useEffect, useState } from "react";
import { useSetupData } from "./setup/setupContextProvider";
import { validateSetupAction } from "./actions/simplCms";
import {
  SetupStep,
  SimplCMSPlatformConfiguration,
  simplCMSPlatformConfigurationObject,
} from "@/types/types";
import {
  SetupValidation,
  SetupValidationComponent,
} from "@/packages/core/src/simplCms";
import { ArrowUp, Check, Loader2, Square, TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const SETUP_DATA_KEY = "setupData";

const setupSteps: { step: SetupStep; description: string }[] = [
  {
    step: "host",
    description: "Setup host provder",
  },
  {
    step: "database",
    description: "Setup database provider",
  },
  {
    step: "mediaStorage",
    description: "Setup media storage provider",
  },
  {
    step: "oauth",
    description: "Setup OAuth provider",
  },
  {
    step: "adminUser",
    description: "Add Admin user",
  },
  {
    step: "redeploy",
    description: "Redeploy",
  },
];

export default function SetupForm({
  serverConfiguration,
}: {
  serverConfiguration: SimplCMSPlatformConfiguration;
}) {
  const [localStorageData, setLocalStorageData] =
    useState<SimplCMSPlatformConfiguration | null>(null);
  const [currentStep, setCurrentStep] = useState<{
    complete: boolean;
    step: SetupStep;
  }>({ complete: false, step: "adminUser" });
  const [nextStep, setNextStep] = useState<{
    url: string;
    text: string;
  }>(getNextStep(currentStep.step));
  const [setupValidation, setSetupValidation] =
    useState<Partial<SetupValidation> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const readFromLocalStorage = () => {
      try {
        if (typeof window !== "undefined") {
          const rawData = localStorage.getItem(SETUP_DATA_KEY);
          if (rawData) {
            const parsedData = JSON.parse(rawData);
            console.log("LOCALSTORAGE FOUND:", parsedData);
            // Validate the data format (optional)
            const validatedData =
              simplCMSPlatformConfigurationObject.parse(parsedData);
            setLocalStorageData(validatedData);
          } else {
            console.log("NO LOCALSTORAGE DATA FOUND");
          }
        }
      } catch (error) {
        console.error("Error reading localStorage:", error);
      }
    };

    readFromLocalStorage();
  }, []);

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

  function getNextStep(step: SetupStep): { url: string; text: string } {
    switch (step) {
      case "host": {
        return {
          url: "/setup/host",
          text: "Setup Host",
        };
      }
      case "database": {
        return {
          url: "/setup/database",
          text: "Setup Database",
        };
      }
      case "mediaStorage": {
        return {
          url: "/setup/media-storage",
          text: "Setup Media Storage",
        };
      }
      case "oauth": {
        return {
          url: "/setup/oauth",
          text: "Setup Oauth",
        };
      }
      case "adminUser": {
        return {
          url: "/setup/add-user",
          text: "Setup Admin User",
        };
      }
      case "redeploy": {
        return {
          url: "/setup/redeploy",
          text: "Redeploy",
        };
      }
      default: {
        throw new Error("Unsupported step");
      }
    }
  }

  useEffect(() => {
    async function getValidation() {
      try {
        setIsLoading(true);

        if (!localStorageData) {
          console.log("Waiting for localStorage data...");
          return;
        }

        console.log(
          "Using localStorage data for validation:",
          localStorageData
        );

        const vercelConfig = (() => {
          const token =
            serverConfiguration.host?.vercel?.token ??
            localStorageData.host?.vercel?.token;
          const projectId =
            serverConfiguration.host?.vercel?.projectId ??
            localStorageData.host?.vercel?.projectId;
          const teamId =
            serverConfiguration.host?.vercel?.teamId ??
            localStorageData.host?.vercel?.teamId;
          if (!token || !projectId || !teamId) {
            return undefined;
          }
          return {
            token,
            projectId,
            teamId,
          };
        })();

        const validation = await validateSetupAction({
          provider:
            serverConfiguration.host?.provider ??
            localStorageData.host?.provider,
          vercelConfig,
          setupData: localStorageData,
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
        console.error("Error fetching setup validation:", error);
      } finally {
        setIsLoading(false);
      }
    }

    getValidation();
  }, [localStorageData, serverConfiguration]);

  if (isLoading && !setupValidation) {
    return (
      <div className="flex flex-col justify-center items-center h-40">
        <Loader2 className="h-8 w-8 animate-spin mb-4" />
      </div>
    );
  }

  if (!setupValidation) {
    return (
      <div className="text-center">
        <p className="text-lg mb-2">Unable to load setup validation.</p>
        <p className="text-sm text-gray-600 mb-4">
          This could be due to missing configuration data.
        </p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          Refresh Page
        </Button>
      </div>
    );
  }

  return (
    <>
      {!currentStep.complete && (
        <>
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
                <ArrowUp className="animate-bounce " />
              </div>
            </Button>
          </Link>
        </>
      )}
      {currentStep.complete && (
        <div className="text-center flex flex-col gap-2">
          <span className="flex items-center gap-2 w-full justify-center text-2xl">
            <Check className="text-green-500" /> Setup Complete
          </span>
          <span>
            You can now edit this page via either the dashboard or by editing{" "}
            <code>app/page.tsx</code>
          </span>
        </div>
      )}
    </>
  );
}

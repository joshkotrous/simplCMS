"use client";

import { useEffect, useState } from "react";
import { useSetupData } from "./setup/setupContextProvider";
import { validateSetupAction } from "./actions/simplCms";
import { SetupStep, SimplCMSPlatformConfiguration } from "@/types/types";
import {
  SetupValidation,
  SetupValidationComponent,
  simplCms,
} from "@/packages/core/src/simplCms";
import { ArrowRight, Check, Square, TriangleAlert } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
  const { setupData } = useSetupData();
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

  async function getData() {
    const vercelConfig = (() => {
      const token =
        serverConfiguration.host?.vercel?.token ??
        setupData.host?.vercel?.token;
      const projectId =
        serverConfiguration.host?.vercel?.projectId ??
        setupData.host?.vercel?.projectId;
      const teamId =
        serverConfiguration.host?.vercel?.teamId ??
        setupData.host?.vercel?.teamId;

      if (!token || !projectId || !teamId) {
        return undefined;
      }

      return {
        token,
        projectId,
        teamId,
      };
    })();
    console.log("SETUP DATA", JSON.stringify(setupData, null, 2));
    const setupValidation = await validateSetupAction({
      provider: serverConfiguration.host?.provider ?? setupData.host?.provider,
      vercelConfig,
      setupData,
    });
    console.log("SETUP VALIDATION", JSON.stringify(setupValidation, null, 2));
    const currentStep = getSetupStep(setupValidation);
    const nextStep = getNextStep(currentStep.step);
    setCurrentStep(currentStep);
    setNextStep(nextStep);
    setSetupValidation(setupValidation);
  }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
      {!currentStep.complete && (
        <>
          <h2 className="text-xl text-zinc-400">
            Setup requires a few simple steps
          </h2>
          <div className="flex flex-col gap-2">
            {setupSteps.map((step) => {
              if (!setupValidation) return;
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
              {nextStep.text} <ArrowRight />
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

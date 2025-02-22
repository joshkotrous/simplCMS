import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  getServerEnvVars,
  SetupValidationComponent,
  simplCms,
} from "@/packages/core/src/simplCms";
import { vercel } from "@/packages/core/src/vercel";
import { SetupStep } from "@/types/types";
import { ArrowRight, Check, Square, TriangleAlert } from "lucide-react";
import Link from "next/link";

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

export default async function Home() {
  const { host } = getServerEnvVars();
  if (!host) throw new Error("Host not configured");
  if (!host.vercel) throw new Error("Vercel not configured");
  if (!host.vercel.token || !host.vercel.projectId || !host.vercel.teamId)
    throw new Error("Vercel not configured");

  const setupValidation = await simplCms.validateSetup({
    provider: host.provider,
    vercelConfig: {
      token: host?.vercel?.token,
      projectId: host?.vercel?.projectId,
      teamId: host?.vercel?.teamId,
    },
  });
  console.log(JSON.stringify(setupValidation, null, 2));

  function getStepValidation(step: SetupStep): SetupValidationComponent {
    const stepValidation = setupValidation[step];
    if (stepValidation === undefined) throw new Error("Invalid step");
    return stepValidation;
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

  const currentStep = simplCms.getSetupStep(setupValidation);
  const nextStep = getNextStep(currentStep.step);
  return (
    <TooltipProvider>
      <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)] bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] bg-background dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]">
        <main className="flex gap-4 items-center flex-col text-foreground">
          <h1 className="text-4xl font-bold">SimplCMS</h1>

          {!currentStep.complete && (
            <>
              <h2 className="text-xl text-zinc-400">
                Setup requires a few simple steps
              </h2>
              <div className="flex flex-col gap-2">
                {setupSteps.map((step) => {
                  const { errors, setupComplete } = getStepValidation(
                    step.step
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
                You can now edit this page via either the dashboard or by
                editing <code>app/page.tsx</code>
              </span>
            </div>
          )}

          <a
            className="rounded-full border border-solid border-black/[.08] dark:border-white/[.145] transition-colors flex items-center justify-center hover:bg-[#f2f2f2] dark:hover:bg-[#1a1a1a] hover:border-transparent text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44 text-foreground"
            href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
            target="_blank"
            rel="noopener noreferrer"
          >
            Read our docs
          </a>
        </main>
      </div>
    </TooltipProvider>
  );
}

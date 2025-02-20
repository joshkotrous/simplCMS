import { Button } from "@/components/ui/button";
import { simplCms } from "@/packages/core/src/simplCms";
import { SetupStep } from "@/types/types";
import { ArrowRight, Check, Square } from "lucide-react";
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
    step: "redeploy",
    description: "Redeploy",
  },
  {
    step: "adminUser",
    description: "Add Admin user",
  },
];

export default function Home() {
  const setupValidation = simplCms.validateSetup();
  console.log(JSON.stringify(setupValidation, null, 2));

  function checkStepCompleted(step: SetupStep): boolean {
    console.log(step);
    const completed = setupValidation[step]?.setupComplete;
    if (completed === undefined) throw new Error("Invalid step");
    return completed;
  }

  return (
    <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)] bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] bg-background dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]">
      <main className="flex gap-4 items-center flex-col text-foreground">
        <h1 className="text-4xl font-bold">SimplCMS</h1>
        <h2 className="text-xl text-zinc-400">
          Setup requires a few simple steps
        </h2>
        <div className="flex flex-col gap-2">
          {setupSteps.map((step) => (
            <div key={step.step} className="flex gap-2 items-center">
              {checkStepCompleted(step.step) ? (
                <Check className="size-4 text-green-500" />
              ) : (
                <Square className="size-4" />
              )}
              <p>{step.description}</p>
            </div>
          ))}
        </div>
        <Link href="/setup" className="w-full">
          <Button className="w-full">
            Setup Host Provider <ArrowRight />
          </Button>
        </Link>

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
  );
}

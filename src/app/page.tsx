import { TooltipProvider } from "@/components/ui/tooltip";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import SetupForm from "./setupForm";
import { Page } from "@/types/types";
import PageRenderer from "./pageRenderer";
import { defaultHomePageConfig } from "@/lib/utils";

export default async function Home() {
  const platformConfiguration = getServerEnvVars();
  let pageConfig: Page = defaultHomePageConfig;
  if (platformConfiguration.database) {
    const page = await simplCms.pages.getPageByRoute("/");
    if (page) {
      pageConfig = page;
    }
  }

  return (
    <TooltipProvider>
      <div className="size-full flex justify-center items-center overflow-hidden font-[family-name:var(--font-geist-sans)] pt-20">
        <div className="size-full absolute top-0 left-0 z-0 bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] bg-background dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]" />
        <main className="flex gap-4 items-center flex-col z-50 text-foreground">
          <PageRenderer page={pageConfig} />
        </main>
      </div>
    </TooltipProvider>
  );
}

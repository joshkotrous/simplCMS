"use server";
import { SetupProvider } from "../../client/components/setupContextProvider";
import ThemeToggle from "../../client/components/themeToggle";

export default async function SetupLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SetupProvider>
      <div className="w-screen h-screen bg-simplcms-background bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]  text-simplcms-foreground">
        <div className="flex w-full justify-end p-2">
          <ThemeToggle />
        </div>

        {children}
      </div>
    </SetupProvider>
  );
}

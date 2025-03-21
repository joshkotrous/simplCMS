"use server";
import React from "react";
import { Toaster } from "sonner";
import { SiteProvider } from "../../client/components/siteContextProvider";
import AdminToolbar from "../../client/components/adminToolbar";
import "../../simplcms.css";
import { cookies } from "next/headers";
import { User } from "../../../types/types";
import Navigation from "../../client/components/navigation";

export default async function RootLayout({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user?: User;
}>) {
  const cookieStore = await cookies();
  const darkModeCookie = cookieStore.get("darkMode");
  const darkMode = darkModeCookie?.value === "true";

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="h-screen w-screen overflow-hidden bg-simplcms-background simplcms-body">
        <SiteProvider initialSettings={{ darkMode }}>
          <div className="z-50 fixed w-screen top-0">
            <AdminToolbar user={user ?? null} />
            <Navigation />
          </div>
          {children}
          <Toaster
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "bg-simplcms-background border p-4 dark:border-dark text-simplcms-foreground rounded-md flex gap-2 items-center text-sm w-[23rem]",
                title: "text-simplcms-foreground font-normal",
                description: "text-simplcms-foreground font-normal",
              },
            }}
          />
        </SiteProvider>
      </body>
    </html>
  );
}

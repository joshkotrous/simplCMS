import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SiteProvider } from "./siteContextProvider";
import AdminToolbar from "./adminToolbar";
import "./globals.css";
import { cookies } from "next/headers";
import { CSSProperties } from "react";
import Navigation from "./ navigation";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/packages/core/src/user";
import { redirect } from "next/navigation";
import { User } from "@/types/types";
import { getServerEnvVars } from "@/packages/core/src/simplCms";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const platformConfiguration = getServerEnvVars();
  const cookieStore = await cookies();
  const darkModeCookie = cookieStore.get("darkMode");
  const darkMode = darkModeCookie?.value === "true";
  let user: User | null = null;
  if (platformConfiguration.database && platformConfiguration.oauth) {
    const session = await getServerSession();
    if (session?.user?.email) {
      user = await getUserByEmail(session.user.email);
    }
  }

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="h-screen w-screen overflow-hidden bg-background">
        <SiteProvider initialSettings={{ darkMode }}>
          <div className="z-50 fixed w-screen top-0">
            <AdminToolbar user={user} />
            <Navigation />
          </div>
          {children}
          <Toaster
            toastOptions={{
              unstyled: true,
              classNames: {
                toast:
                  "bg-background border p-4 dark:border-dark text-foreground rounded-md flex gap-2 items-center text-sm w-[23rem]",
                title: "text-foreground font-normal",
                description: "text-foreground font-normal",
              },
            }}
          />
        </SiteProvider>
      </body>
    </html>
  );
}

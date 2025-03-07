import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { SiteProvider } from "./siteContextProvider";
import AdminToolbar from "./adminToolbar";
import "./globals.css";
import { cookies } from "next/headers";
import { CSSProperties } from "react";
import Navigation from "./ navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// function useGlobalStyles(styles?: any): CSSProperties {
//   return {
//     "--h2-font-size": styles?.h1?.fontSize || "3rem",
//     "--h2-font-weight": styles?.h1?.fontWeight || "600",
//   } as CSSProperties;
// }

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const darkModeCookie = cookieStore.get("darkMode");
  const darkMode = darkModeCookie?.value === "true";
  // const globalStyles = useGlobalStyles();

  return (
    <html lang="en" className={darkMode ? "dark" : ""}>
      <body className="h-screen w-screen overflow-hidden">
        <SiteProvider initialSettings={{ darkMode }}>
          <div className="fixed w-screen top-0">
            <AdminToolbar />
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

import type { Metadata } from "next";
import { Toaster } from "sonner";
import { SiteProvider } from "../components/siteContextProvider";
import AdminToolbar from "../components/adminToolbar";
import "../globals.css";
import { cookies } from "next/headers";
import { User } from "@/types";
import Navigation from "../components/navigation";

export const metadata: Metadata = {
  title: "SimplCMS",
  description: "Content management simplified",
};

export default async function RootLayout({
  children,
  user,
}: Readonly<{
  children: React.ReactNode;
  user: User;
}>) {
  const cookieStore = await cookies();
  const darkModeCookie = cookieStore.get("darkMode");
  const darkMode = darkModeCookie?.value === "true";

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

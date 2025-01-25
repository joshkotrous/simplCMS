import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { getServerSession } from "next-auth";
import { getUserByEmail } from "@/packages/core/src/user";
import { User } from "@/types/types";
import { SiteProvider } from "./siteContextProvider";
import AdminToolbar from "./adminToolbar";
import "./globals.css";

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
  let user: User | null = null;
  const session = await getServerSession();
  if (session && session.user.email)
    user = await getUserByEmail(session.user.email);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased w-screen h-screen overflow-hidden`}
      >
        <SiteProvider>
          {user && session && <AdminToolbar />}
          {children}
          <Toaster />
        </SiteProvider>
      </body>
    </html>
  );
}

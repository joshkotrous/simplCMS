"use server";
import Link from "next/link";
import { Button } from "../../../app/client/components/ui/button";
import {
  SidebarProvider,
  SidebarTrigger,
} from "../../../app/client/components/ui/sidebar";
import AdminSidebar from "../../../app/client/components/adminSidebar";
import ThemeToggle from "../../../app/client/components/themeToggle";
import { User } from "../../../types/types";

export default async function AdminLayout({
  children,
  user,
}: {
  children: React.ReactNode;
  user: User;
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";
  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <div className="h-screen w-screen overflow-hidden flex flex-col bg-background text-foreground">
        <div className="flex justify-between items-start">
          <SidebarTrigger className="text-foreground ml-1 mt-1" />
          <div className="flex items-center gap-1">
            <ThemeToggle />
            <Link href={siteUrl} className="p-2">
              <Button className="text-xs">Go to Site</Button>
            </Link>
          </div>
        </div>

        <div className="flex h-fit justify-between items-center p-4">
          <div className="flex gap-4 items-center"></div>
        </div>

        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    </SidebarProvider>
  );
}

import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserByEmail, userHasAccess } from "@/user";
import { Button } from "@/app/components/ui/button";
import { SidebarProvider, SidebarTrigger } from "@/app/components/ui/sidebar";
import AdminSidebar from "@/app/components/adminSidebar";
import ThemeToggle from "@/app/components/themeToggle";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession();
  if (!session?.user?.email) redirect("/login");

  const user = await getUserByEmail(session.user.email);
  if (!user) throw new Error("Cannot get user");

  const hasAccess = await userHasAccess(user);
  if (!hasAccess) throw new Error("User does not have access");
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

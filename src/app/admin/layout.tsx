import { getServerSession } from "next-auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUserByEmail, userHasAccess } from "@/packages/core/src/user";
import AdminNav from "./adminNav";
import { Button } from "@/components/ui/button";
import UserMenu from "./userMenu";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  try {
    // TODO: Figure out middleware solution
    const session = await getServerSession();
    if (!session?.user?.email) redirect("/login");

    const user = await getUserByEmail(session.user.email);
    if (!user) throw new Error("Cannot get user");

    const hasAccess = await userHasAccess(user);
    if (!hasAccess) throw new Error("User does not have access");
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

    return (
      <div className="h-screen w-screen overflow-hidden flex flex-col">
        <div className="flex h-fit justify-between items-center p-4">
          <Link href="/admin" className="text-xl font-bold">
            Admin
          </Link>
          <div className="flex gap-4 items-center">
            <Link href={siteUrl}>
              <Button className="text-xs">Go to Site</Button>
            </Link>
            <UserMenu user={user} />
          </div>
        </div>
        <AdminNav />
        <div className="flex-1 overflow-auto">{children}</div>
      </div>
    );
  } catch (error) {
    console.error(error);
    throw error;
  }
}

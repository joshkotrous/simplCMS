"use server";
import { simplcms } from "../../../../../core";
import { redirect } from "next/navigation";
import { User } from "../../../../../../types/types";
import AddFirstUserForm from "../../../../client/components/addFirstUserForm";

export default async function AddFirstUserPage() {
  let users: User[] = [];
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  if (platformConfiguration.database) {
    users = await simplcms.users.getAllUsers();
  }
  if (users.length > 0) redirect("/admin/login");
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <AddFirstUserForm />
    </div>
  );
}

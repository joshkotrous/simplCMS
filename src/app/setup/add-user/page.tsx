import { user } from "@/packages/core/src/user";
import AddFirstUserForm from "./addFirstUserForm";
import { redirect } from "next/navigation";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import { User } from "@/types/types";

export default async function AddFirstUserPage() {
  let users: User[] = [];
  const platformConfiguration = getServerEnvVars();
  if (platformConfiguration.database) {
    users = await user.getAllUsers();
  }
  if (users.length > 0) redirect("/login");
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <AddFirstUserForm />
    </div>
  );
}

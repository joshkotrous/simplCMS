import { user } from "@/user";
import { redirect } from "next/navigation";
import { User } from "@/types";
import { getServerEnvVars } from "@/core/platform";
import AddFirstUserForm from "@/app/components/addFirstUserForm";

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

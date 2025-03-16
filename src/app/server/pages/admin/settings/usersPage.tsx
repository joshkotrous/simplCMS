"use server";
import { getAllUsers } from "@/user";
import { User } from "@/types";
import Users from "@/app/client/components/users";
import { getServerEnvVars } from "@/core/platform";

export default async function UserSettingsPage() {
  const platformConfiguration = getServerEnvVars();
  let users: User[] = [];

  if (platformConfiguration.database) {
    users = await getAllUsers();
  }

  return (
    <div className="container mx-auto p-6">
      <Users users={users} />
    </div>
  );
}

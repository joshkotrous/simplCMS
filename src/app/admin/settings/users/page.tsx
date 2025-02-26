import { getAllUsers } from "@/packages/core/src/user";
import Users from "./users";
import { getServerEnvVars } from "@/packages/core/src/simplCms";
import { User } from "@/types/types";

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

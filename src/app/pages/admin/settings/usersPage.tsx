import { getAllUsers } from "@/user";
import { getServerEnvVars } from "@/index";
import { User } from "@/types/types";
import Users from "@/app/components/users";

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

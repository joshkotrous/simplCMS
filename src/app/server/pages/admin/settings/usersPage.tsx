"use server";
import { User } from "../../../../../../types/types";
import Users from "../../../../client/components/users";
import { simplcms } from "../../../../../core";

export default async function UserSettingsPage() {
  const platformConfiguration = simplcms.platform.getPlatformConfiguration();
  let users: User[] = [];

  if (platformConfiguration.database) {
    users = await simplcms.users.getAllUsers();
  }

  return (
    <div className="container mx-auto p-6">
      <Users users={users} />
    </div>
  );
}

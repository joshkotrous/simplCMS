import { getAllUsers } from "@/packages/core/src/user";
import Users from "./users";

export default async function UserSettingsPage() {
  const users = await getAllUsers();

  return (
    <div className="container mx-auto p-6">
      <Users users={users} />
    </div>
  );
}

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AddUserButton from "./addUserButton";
import { getAllUsers } from "@/packages/core/src/user";
import { FaTrashAlt } from "react-icons/fa";

export default async function AdminSettingsPage() {
  const users = await getAllUsers();

  return (
    <div className="p-4 h-full overflow-auto space-y-2">
      <h2 className="text-3xl font-bold">Site Settings</h2>
      <Tabs defaultValue="users" className="flex gap-4 w-full">
        <TabsList className="flex flex-col h-fit">
          <TabsTrigger value="users" className="text-lg font-semibold w-full">
            Users
          </TabsTrigger>
          <TabsTrigger value="site" className="text-lg font-semibold w-full">
            Site
          </TabsTrigger>
        </TabsList>

        <div className="flex-1 w-full flex justify-center">
          <TabsContent value="users" className="w-[44rem]">
            <div className="w-full">
              <h2 className="text-2xl font-bold">Users</h2>
              <div>
                {users.map((user) => (
                  <div key={user._id} className="grid grid-cols-3">
                    <span>{user._id}</span>
                    <span>{user.email}</span>
                    <span className="flex justify-end">
                      <FaTrashAlt />
                    </span>
                  </div>
                ))}
              </div>
              <AddUserButton />
            </div>
          </TabsContent>
          <TabsContent value="site" className="w-[44rem]">
            <div>
              <h2 className="text-2xl font-bold">Site Settings</h2>
            </div>
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

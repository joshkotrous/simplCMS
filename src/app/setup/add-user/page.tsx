import { user } from "@/packages/core/src/user";
import AddFirstUserForm from "./addFirstUserForm";
import { redirect } from "next/navigation";

export default async function AddFirstUserPage() {
  const users = await user.getAllUsers();
  if (users.length > 0) redirect("/login");
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <AddFirstUserForm />
    </div>
  );
}

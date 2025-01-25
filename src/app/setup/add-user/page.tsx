import { user } from "@/packages/core/src/user";
import AddFirstUserForm from "./addFirstUserForm";
import { redirect } from "next/navigation";

export default async function AddFirstUserPage() {
  const users = await user.getAllUsers();
  if (users.length > 0) redirect("/login");
  return (
    <div className="size-full flex justify-center items-center text-foreground">
      <AddFirstUserForm />
    </div>
  );
}

"use client";

import { User } from "@/types/types";
import { Trash } from "lucide-react";
import AddUserButton from "./addUserButton";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import * as userActions from "@/app/actions/user";
import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Image from "next/image";

export default function Users({ users }: { users: User[] }) {
  const router = useRouter();
  async function deleteUser(user: User) {
    toast.promise(userActions.deleteUserAction(user), {
      loading: `Deleting ${user.email}...`,
      success: () => {
        router.refresh();
        return `Successfully deleted ${user.email}.`;
      },
      error: () => {
        return `Error deleting ${user.email}.`;
      },
    });
  }

  return (
    <div className="w-full space-y-2">
      <h2 className="text-2xl font-bold">Users</h2>
      <div className="h-[12rem] overflow-scroll">
        {users.map((user) => (
          <div
            key={user._id}
            className="grid grid-cols-3 items-center border-b py-2"
          >
            <span className="flex items-center gap-2">
              <Avatar className="size-8">
                <Image
                  alt={`user-profile-${user._id}`}
                  width={100}
                  height={100}
                  src={user.imageUrl}
                />
                <AvatarFallback>
                  {user.name ? `${user.name[0]}${user.name[1]}` : ""}
                </AvatarFallback>
              </Avatar>
              {user.name}
            </span>
            <span>{user.email}</span>
            <span className="flex justify-end">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash className="size-4 hover:text-red-600 transition-all" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to delet {user.email}? They will lose
                    access to SimplCMS admin.
                  </AlertDialogDescription>
                  <AlertDialogAction onClick={() => deleteUser(user)}>
                    Delete User
                  </AlertDialogAction>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                </AlertDialogContent>
              </AlertDialog>
            </span>
          </div>
        ))}
      </div>
      <AddUserButton />
    </div>
  );
}

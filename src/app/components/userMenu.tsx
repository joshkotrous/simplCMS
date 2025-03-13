"use client";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/app/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { User } from "@/types/types";
export default function UserMenu({ user }: { user: User }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="rounded-md">
          {user.imageUrl && <AvatarImage alt="profile" src={user.imageUrl} />}
          <AvatarFallback className="uppercase">
            {user.name ? `${user.name[0]}${user.name[1]}` : ""}
          </AvatarFallback>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => signOut()}>
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </Avatar>
      </DropdownMenuTrigger>
    </DropdownMenu>
  );
}

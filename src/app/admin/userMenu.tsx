"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { UserType } from "@/types/types";
import Image from "next/image";
export default function UserMenu({ user }: { user: UserType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar className="rounded-md">
          <AvatarImage alt="profile" src={user.imageUrl} />
          <AvatarFallback className="uppercase">
            {user.name[0]}
            {user.name[1]}
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

"use client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { signOut } from "next-auth/react";
import { UserType } from "@/types/types";
export default function UserMenu({ user }: { user: UserType }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Avatar>
          <AvatarFallback className="uppercase">
            {user.email[0]}
            {user.email[1]}
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

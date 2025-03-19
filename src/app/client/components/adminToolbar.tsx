"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "./themeToggle";
import { User } from "../../../types/types";
import "../../globals.css";

export default function AdminToolbar({ user }: { user: User | null }) {
  const path = usePathname();
  const hide =
    path.includes("/admin") ||
    path.includes("/login") ||
    path.includes("/setup") ||
    !user;

  if (hide) {
    return null;
  }

  return (
    <div className="p-2 text-sm bg-zinc-100 dark:bg-zinc-900 dark:text-zinc-400 text-simplcms-foreground flex justify-between items-center">
      <span>Admin Mode</span>

      <div className="space-x-2 flex items-center">
        <ThemeToggle />
        <div className="space-x-4">
          <Link href="/admin" className="hover:text-zinc-500 transition-all">
            Dashboard
          </Link>
          <span
            onClick={() => signOut()}
            className="hover:text-zinc-500 transition-all cursor-pointer"
          >
            Sign Out
          </span>
        </div>
      </div>
    </div>
  );
}

"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminToolbar() {
  const path = usePathname();
  const hide =
    path.includes("/admin") ||
    path.includes("/login") ||
    path.includes("/setup");

  if (hide) {
    return null;
  }

  return (
    <div className="p-2 text-sm bg-zinc-100 flex justify-between">
      <span>Admin Mode</span>
      <div className="space-x-4">
        <Link href="/admin" className="hover:text-zinc-500 transition-all">
          Go to Dashboard
        </Link>
        <span
          onClick={() => signOut()}
          className="hover:text-zinc-500 transition-all cursor-pointer"
        >
          Sign Out
        </span>
      </div>
    </div>
  );
}

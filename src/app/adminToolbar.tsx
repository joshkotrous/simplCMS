"use client";

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
      <span>Go To Dashboard</span>
    </div>
  );
}

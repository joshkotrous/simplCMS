"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const path = usePathname();
  const isPagesPage = path.endsWith("/pages");
  const isPostsPage = path.includes("/posts");
  const isSettingsPage = path.endsWith("/settings");

  return (
    <div className="w-full h-fit items-center flex gap-16 border-b">
      <Link
        href="/admin/pages"
        className={`px-4 py-1 ${isPagesPage && "border-b-2 border-black"}`}
      >
        Pages
      </Link>
      <Link
        href="/admin/posts"
        className={`px-4 py-1 ${isPostsPage && "border-b-2 border-black"}`}
      >
        Posts
      </Link>
      <Link
        href="/admin/settings"
        className={`px-4 py-1 ${isSettingsPage && "border-b-2 border-black"}`}
      >
        Settings
      </Link>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminNav() {
  const path = usePathname();
  const isPagesPage = path.endsWith("/admin/pages");
  const isPostsPage = path.includes("/admin/posts");
  const isSettingsPage = path.endsWith("/admin/settings");
  const isMediaPage = path.endsWith("/admin/media");

  return (
    <div className="w-full h-fit items-center flex border-b">
      <Link
        href="/admin/pages"
        className={`px-16 py-1 hover:border-b-2 hover:border-foreground ${
          isPagesPage && "border-b-2 border-foreground"
        }`}
      >
        Pages
      </Link>
      <Link
        href="/admin/posts"
        className={`px-16 py-1 hover:border-b-2 hover:border-foreground ${
          isPostsPage && "border-b-2 border-foreground"
        }`}
      >
        Posts
      </Link>
      <Link
        href="/admin/media"
        className={`px-16 py-1 hover:border-b-2 hover:border-foreground ${
          isMediaPage && "border-b-2 border-foreground"
        }`}
      >
        Media
      </Link>
      <Link
        href="/admin/settings"
        className={`px-16 py-1 hover:border-b-2 hover:border-foreground ${
          isSettingsPage && "border-b-2 border-foreground"
        }`}
      >
        Settings
      </Link>
    </div>
  );
}

"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const navItems = [
    {
      url: "/",
      label: "Home",
    },
    {
      url: "/blog",
      label: "Blog",
    },
  ];
  const path = usePathname();
  const hide =
    path.includes("/admin") ||
    path.includes("/login") ||
    path.includes("/setup");

  if (hide) {
    return null;
  }
  return (
    <nav className="grid grid-cols-[1fr_1fr_1fr] text-foreground p-4">
      <div>SimplCMS</div>
      <div>
        <ul className="flex gap-8 justify-center">
          {navItems.map((item) => (
            <Link key={item.label} href={item.url}>
              <li>{item.label}</li>
            </Link>
          ))}
        </ul>
      </div>
      <div></div>
    </nav>
  );
}

"use client";

import { Moon, Sun } from "lucide-react";
import { useSiteSettings } from "./siteContextProvider";

export default function ThemeToggle() {
  const { settings, updateSetting } = useSiteSettings();

  return (
    <div
      onClick={() => updateSetting("darkMode", !settings.darkMode)}
      className="p-1 cursor-pointer"
      aria-label="Toggle dark mode"
    >
      {settings.darkMode ? (
        <Sun className="size-4 text-foreground hover:text-yellow-500" />
      ) : (
        <Moon className="size-4 text-foreground hover:text-indigo-700" />
      )}
    </div>
  );
}

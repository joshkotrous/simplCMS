"use client";

import { Button } from "./ui/button";
import { SiteConfig } from "../../../types/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { initSiteConfig } from "../../../core/serverActions/simplCms";
export function InitSiteConfig({
  siteConfig,
}: {
  siteConfig: SiteConfig | null;
}) {
  const router = useRouter();
  async function initConfig() {
    toast.promise(initSiteConfig(), {
      loading: "Initialize site configuration...",
      success: () => {
        router.refresh();
        return "Successfully initialize site configuration";
      },
      error: () => {
        return "Error initializing site configuration";
      },
    });
  }

  return (
    <div className="">
      {!siteConfig && (
        <div className="flex flex-col gap-2">
          <span>No Configuration Found</span>
          <Button onClick={() => initConfig()} className="w-fit">
            Initialize Site Configuration
          </Button>
        </div>
      )}
    </div>
  );
}

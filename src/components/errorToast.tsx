"use client";

import { useEffect } from "react";
import { toast } from "sonner";

export default function ErrorToast({ error }: { error: any }) {
  useEffect(() => {
    toast.error(
      <div className="flex items-center gap-2 min-w-0 max-w-full">
        <span className="truncate">Error occurred: {error}</span>
      </div>
    );
  }, [error]);

  return null;
}

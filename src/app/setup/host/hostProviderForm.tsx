"use client";

import { VercelLogo } from "@/components/logos";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSetupData } from "../setupContextProvider";

export default function HostProviderForm() {
  const { setSetupData } = useSetupData();
  return (
    <Link
      onClick={() =>
        setSetupData((prev) => ({ ...prev, host: { provider: "Vercel" } }))
      }
      href="/setup/vercel"
    >
      <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
        <CardContent className="p-0 ">
          <VercelLogo />
        </CardContent>
      </Card>
    </Link>
  );
}

"use client";

import { AWSS3Logo, CloudinaryLogo, SupabaseLogo } from "@/components/logos";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useSetupData } from "../setupContextProvider";

export default function MediaStorageProviderForm() {
  const { setSetupData } = useSetupData();
  return (
    <div className="flex gap-4 flex-col items-center">
      <p>Select a Media Storage Provider</p>
      <div className="grid grid-cols-3 gap-4 w-[44rem]">
        <Link
          onClick={() =>
            setSetupData((prev) => ({
              ...prev,
              mediaStorage: [
                ...(prev.mediaStorage || []),
                { provider: "Cloudinary" },
              ],
            }))
          }
          href="/setup/media-storage/cloudinary"
        >
          <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
            <CardContent className="p-0 ">
              <CloudinaryLogo />
            </CardContent>
          </Card>
        </Link>
        <Link
          onClick={() =>
            setSetupData((prev) => ({
              ...prev,
              mediaStorage: [
                ...(prev.mediaStorage || []),
                { provider: "AWS S3" },
              ],
            }))
          }
          href="/setup/media-storage/s3"
        >
          <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer text-center bg-zinc-200 text-foreground">
            <CardContent className="p-0 gap-4 flex flex-col">
              <AWSS3Logo />
              <span className="font-semibold">AWS S3</span>
            </CardContent>
          </Card>
        </Link>

        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <SupabaseLogo />
            <span className="font-semibold">Supabase Storage</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

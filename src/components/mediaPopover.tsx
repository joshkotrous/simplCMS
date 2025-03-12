"use client";

import { CloudinaryMedia, SimplCMSMedia } from "@/types/types";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import Image from "next/image";
import { Input } from "./ui/input";
import { useState } from "react";
import * as mediaActions from "@/app/actions/media";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function MediaPopover({
  media,
  children,
}: {
  media: SimplCMSMedia[];
  children: React.ReactNode;
}) {
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const router = useRouter();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const files = Array.from(e.target.files);
    setFilesToUpload(files);
    setIsUploading(true);

    toast.promise(mediaActions.uploadMediaAction(files), {
      loading: "Uploading media...",
      success: () => {
        setIsUploading(false);
        setFilesToUpload([]);
        router.refresh();
        return "Successfully uploaded media.";
      },
      error: (error) => {
        setIsUploading(false);
        setFilesToUpload([]);
        return `Error uploading media: ${error.message}`;
      },
    });

    e.target.value = "";
  };

  return (
    <Popover>
      <PopoverTrigger asChild>{children}</PopoverTrigger>
      <PopoverContent className="h-64 overflow-scroll p-0">
        <div className="sticky top-0 p-1 px-2 text-sm flex justify-end z-50 bg-background">
          <Link
            href="/admin/media"
            className="flex gap-1 items-center hover:text-zinc-400 transition-all cursor-pointer"
          >
            Manage Media <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="grid grid-cols-3 gap-2 p-2">
          {media.map((item) => (
            <button
              key={item.id}
              className="relative aspect-square w-full overflow-hidden rounded-lg hover:ring-2 hover:ring-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Image
                alt={item.name}
                className="object-cover"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                src={item.url}
              />
            </button>
          ))}
        </div>
        <div className="sticky bottom-0 w-full bg-background p-2">
          {!isUploading && (
            <Input
              className="text-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              id="picture"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={handleFileChange}
              disabled={isUploading}
            />
          )}

          {isUploading && (
            <p className="text-sm text-muted-foreground p-2">
              Uploading {filesToUpload.length} file(s)...
            </p>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { ArrowLeft, Pencil, Trash } from "lucide-react";
import Image from "next/image";
import { MediaGrid } from "./mediaGrid";

export default async function AdminMediaPage() {
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  return (
    <div className="container mx-auto p-6 space-y-8">
      <MediaGrid media={media} />
    </div>
  );
}

// function formatFileSize(bytes: number): string {
//   const units = ["B", "KB", "MB", "GB"];
//   let size = bytes;
//   let unitIndex = 0;

//   while (size >= 1024 && unitIndex < units.length - 1) {
//     size /= 1024;
//     unitIndex++;
//   }

//   return `${size.toFixed(1)} ${units[unitIndex]}`;
// }

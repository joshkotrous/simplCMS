import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cloudinary } from "@/packages/core/src/cloudinary";
import { AlertDialogTitle } from "@radix-ui/react-alert-dialog";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";

export default async function AdminMediaPage() {
  const media = await cloudinary.getMedia();

  return (
    <div className="container mx-auto p-6 space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <p className="text-sm text-muted-foreground">{media.length} items</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...media].map((item) => (
          <AlertDialog key={item.asset_id}>
            <AlertDialogTrigger>
              <div className="group relative aspect-square overflow-hidden rounded-lg bg-secondary/10">
                <Image
                  alt={item.display_name}
                  className="object-cover transition-all duration-300 group-hover:scale-105"
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
                  src={item.secure_url}
                />

                <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <p className="text-xs text-foreground truncate">
                      {item.display_name}
                    </p>
                    {/* <p className="text-xs text-foreground/60">
                          {formatFileSize(item.bytes)}
                        </p> */}
                  </div>
                </div>
              </div>
            </AlertDialogTrigger>
            <AlertDialogContent className="max-w-[48rem] h-[40rem] bg-transparent border-none dark:bg-transparent p-0">
              <AlertDialogTitle className="hidden">
                {item.display_name}
              </AlertDialogTitle>
              <div className="flex justify-between w-full">
                <ArrowLeft />
                <Image
                  alt={item.display_name}
                  className="object-contain"
                  fill
                  src={item.secure_url}
                />
              </div>
            </AlertDialogContent>
          </AlertDialog>
        ))}
      </div>
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

"use client";
import { deleteMediaAction } from "@/app/actions/media";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SimplCMSMedia } from "@/types/types";
import { ArrowLeft, Pencil, Trash, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function MediaGrid({ media }: { media: SimplCMSMedia[] }) {
  const router = useRouter();
  const [previewMedia, setPreviewMedia] = useState<SimplCMSMedia | null>(null);

  const [deleteMedia, setDeleteMedia] = useState<SimplCMSMedia | null>(null);

  const handleDeleteMedia = async () => {
    if (!deleteMedia) return;

    toast.promise(deleteMediaAction(deleteMedia), {
      loading: "Deleting media...",
      success: () => {
        setDeleteMedia(null);
        router.refresh();
        return "Successfully deleted media";
      },
      error: () => {
        return "Error deleting media";
      },
    });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <div className="flex gap-2 items-center">
          <Button variant="ghost">
            <Upload />
          </Button>
          <p className="text-sm text-muted-foreground">{media.length} items</p>
        </div>
      </div>
      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...media].map((item) => (
          <div
            key={item.id}
            className="group relative aspect-square overflow-hidden rounded-lg bg-secondary/10"
            onClick={() => setPreviewMedia(item)}
          >
            <Image
              alt={item.name}
              className="object-cover transition-all duration-300 group-hover:scale-105"
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, (max-width: 1280px) 20vw, 16vw"
              src={item.url}
            />

            {/* Action buttons */}
            <div className="absolute top-2 flex px-2 items-center justify-between w-full opacity-0 group-hover:opacity-100 transition-opacity z-10">
              <Checkbox className="border-white" />
              <div className="flex space-x-2 items-center">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteMedia(item);
                  }}
                  className="p-1 bg-white rounded-full shadow-md text-gray-700 hover:text-red-500"
                >
                  <Trash size={16} />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    // Handle edit functionality here
                  }}
                  className="p-1 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-500"
                >
                  <Pencil size={16} />
                </button>
              </div>
            </div>

            {/* Image info overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs text-foreground truncate">{item.name}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Preview Dialog */}
      <AlertDialog
        open={!!previewMedia}
        onOpenChange={(open) => !open && setPreviewMedia(null)}
      >
        <AlertDialogContent className="max-w-5xl h-auto max-h-[80vh] bg-transparent border-none p-0 overflow-hidden">
          <AlertDialogTitle></AlertDialogTitle>
          <div className="relative w-full h-full flex items-center justify-center">
            <button
              onClick={() => setPreviewMedia(null)}
              className="absolute top-4 left-4 p-2 bg-black/50 text-white rounded-full z-20"
            >
              <X size={20} />
            </button>

            {previewMedia && (
              <div className="relative w-full h-full flex items-center justify-center bg-black/80 p-4">
                <Image
                  alt={previewMedia.name}
                  className="object-contain max-h-[70vh]"
                  src={previewMedia.url}
                  width={1200}
                  height={800}
                />
              </div>
            )}
          </div>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteMedia}
        onOpenChange={(open) => !open && setDeleteMedia(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete media?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              media from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMedia}>
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

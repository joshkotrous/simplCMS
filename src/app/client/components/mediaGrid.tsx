"use client";
import {
  deleteMediaAction,
  updateMediaNameAction,
} from "@/core/serverActions/simplCms/media";
import MediaAlertDialog from "@/app/client/components/mediaAlertDialog";
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
} from "@/app/client/components/ui/alert-dialog";
import { Button } from "@/app/client/components/ui/button";
import { Checkbox } from "@/app/client/components/ui/checkbox";
import { Input } from "@/app/client/components/ui/input";
import { Label } from "@/app/client/components/ui/label";
import { SimplCMSMedia } from "@/types";
import { ArrowLeft, Pencil, Trash, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
export function MediaGrid({ media }: { media: SimplCMSMedia[] }) {
  const router = useRouter();
  const [previewMedia, setPreviewMedia] = useState<SimplCMSMedia | null>(null);
  const [editMedia, setEditMedia] = useState<SimplCMSMedia | null>(null);
  const [deleteMedia, setDeleteMedia] = useState<SimplCMSMedia | null>(null);
  const [newFileName, setNewFileName] = useState<string>("");
  const [selectedMedia, setSelectedMedia] = useState<Set<string>>(new Set());
  const [isSelectionMode, setIsSelectionMode] = useState<boolean>(false);
  const [showBulkDeleteDialog, setShowBulkDeleteDialog] =
    useState<boolean>(false);

  // Handle single media delete
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

  // Handle bulk media delete
  const handleBulkDeleteMedia = async () => {
    if (selectedMedia.size === 0) return;

    const deletePromises = media
      .filter((item) => selectedMedia.has(item.id))
      .map((item) => deleteMediaAction(item));

    toast.promise(Promise.all(deletePromises), {
      loading: `Deleting ${selectedMedia.size} media items...`,
      success: () => {
        setSelectedMedia(new Set());
        setIsSelectionMode(false);
        setShowBulkDeleteDialog(false);
        router.refresh();
        return `Successfully deleted ${selectedMedia.size} media items`;
      },
      error: () => {
        return "Error deleting media items";
      },
    });
  };

  // Handle opening the edit dialog
  const handleEditClick = (item: SimplCMSMedia, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditMedia(item);
    setNewFileName(item.name);
  };

  // Function to handle the rename/update operation
  const handleUpdateMedia = async () => {
    if (!editMedia || !newFileName.trim()) return;
    toast.promise(updateMediaNameAction(editMedia, newFileName), {
      loading: "Updating media name...",
      success: () => {
        setEditMedia(null);
        router.refresh();
        return "Successfully updated media name";
      },
      error: (error) => {
        console.error("Error updating media name:", error);
        return "Error updating media name";
      },
    });
  };

  // Toggle selection for a media item
  const toggleSelection = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();

    const newSelection = new Set(selectedMedia);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }

    setSelectedMedia(newSelection);

    // If we're not in selection mode and just selected something, enter selection mode
    if (!isSelectionMode && newSelection.size > 0) {
      setIsSelectionMode(true);
    }

    // If we just deselected everything, exit selection mode
    if (isSelectionMode && newSelection.size === 0) {
      setIsSelectionMode(false);
    }
  };

  // Clear all selections
  const clearSelections = () => {
    setSelectedMedia(new Set());
    setIsSelectionMode(false);
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Media Library</h2>
        <div className="flex gap-2 items-center">
          {isSelectionMode ? (
            <>
              <Button
                variant="destructive"
                onClick={() => setShowBulkDeleteDialog(true)}
                disabled={selectedMedia.size === 0}
                className="flex items-center gap-1"
              >
                <Trash size={16} />
                Delete Selected ({selectedMedia.size})
              </Button>
              <Button variant="outline" onClick={clearSelections}>
                Cancel
              </Button>
            </>
          ) : (
            <MediaAlertDialog>
              <Button variant="ghost">
                <Upload />
              </Button>
            </MediaAlertDialog>
          )}
          <p className="text-sm text-muted-foreground">{media.length} items</p>
        </div>
      </div>
      {/* Media Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {[...media].map((item) => (
          <div
            key={item.id}
            className={`group relative aspect-square overflow-hidden rounded-lg ${
              selectedMedia.has(item.id)
                ? "ring-2 ring-primary"
                : "bg-secondary/10"
            }`}
            onClick={() => !isSelectionMode && setPreviewMedia(item)}
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
              <Checkbox
                className="border-white"
                checked={selectedMedia.has(item.id)}
                onCheckedChange={() => {
                  const newSelection = new Set(selectedMedia);
                  if (newSelection.has(item.id)) {
                    newSelection.delete(item.id);
                  } else {
                    newSelection.add(item.id);
                  }
                  setSelectedMedia(newSelection);
                  if (newSelection.size > 0 && !isSelectionMode) {
                    setIsSelectionMode(true);
                  }
                  if (newSelection.size === 0 && isSelectionMode) {
                    setIsSelectionMode(false);
                  }
                }}
                onClick={(e) => e.stopPropagation()}
              />
              {!isSelectionMode && (
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
                    onClick={(e) => handleEditClick(item, e)}
                    className="p-1 bg-white rounded-full shadow-md text-gray-700 hover:text-blue-500"
                  >
                    <Pencil size={16} />
                  </button>
                </div>
              )}
            </div>
            {/* Image info overlay on hover */}
            <div className="absolute inset-0 bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <p className="text-xs text-foreground truncate">{item.name}</p>
              </div>
            </div>
            {/* Selection overlay */}
            {selectedMedia.has(item.id) && (
              <div
                className="absolute inset-0 bg-primary/20"
                onClick={(e) => {
                  if (isSelectionMode) {
                    toggleSelection(item.id, e);
                  }
                }}
              >
                {/* Checkbox remains in top-left corner when selected */}
                <div className="absolute top-2 left-2">
                  <Checkbox checked={true} className="border-white" />
                </div>
              </div>
            )}
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
      {/* Bulk Delete Confirmation Dialog */}
      <AlertDialog
        open={showBulkDeleteDialog}
        onOpenChange={(open) => !open && setShowBulkDeleteDialog(false)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {selectedMedia.size} items?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              selected media from your library.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowBulkDeleteDialog(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleBulkDeleteMedia}>
              Delete All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      {/* Edit Media Name Dialog */}
      <AlertDialog
        open={!!editMedia}
        onOpenChange={(open) => !open && setEditMedia(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit file name</AlertDialogTitle>
            <AlertDialogDescription>
              Enter a new name for this media file.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="grid gap-4 py-4 text-foreground">
            {editMedia && (
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md">
                  <Image
                    alt={editMedia.name}
                    className="object-cover"
                    fill
                    sizes="64px"
                    src={editMedia.url}
                  />
                </div>
                <div className="flex-1 space-y-1">
                  <Label htmlFor="fileName" className="text-sm font-medium">
                    File name
                  </Label>
                  <Input
                    id="fileName"
                    value={newFileName}
                    onChange={(e) => setNewFileName(e.target.value)}
                    placeholder="Enter new file name"
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleUpdateMedia}>
              Update
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

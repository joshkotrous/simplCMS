"use client";
import { Image as ImageIcon, Loader2, X } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { Input } from "./ui/input";
import { toast } from "sonner";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import * as mediaActions from "@/app/serverActions/simplCms/media";
import Image from "next/image";
export default function MediaAlertDialog({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [filesToUpload, setFilesToUpload] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const newFiles = Array.from(e.target.files);

    // Combine new files with existing files
    const updatedFiles = [...filesToUpload, ...newFiles];
    setFilesToUpload(updatedFiles);

    // Generate previews for the new files
    const newPreviews = await Promise.all(
      newFiles.map((file) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve(e.target?.result as string);
          };
          reader.readAsDataURL(file);
        });
      })
    );

    // Combine new previews with existing previews
    setPreviews([...previews, ...newPreviews]);

    // Reset the input field
    e.target.value = "";
  };

  const handleUpload = async () => {
    if (!filesToUpload.length) return;
    setIsUploading(true);
    toast.promise(mediaActions.uploadMediaAction(filesToUpload), {
      loading: "Uploading media...",
      success: () => {
        setIsUploading(false);
        clearSelections();
        router.refresh();
        setOpen(false);
        return "Successfully uploaded media.";
      },
      error: (error) => {
        setIsUploading(false);
        return `Error uploading media: ${error.message}`;
      },
    });
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files.length) {
      const newFiles = Array.from(e.dataTransfer.files);

      // Combine new files with existing files
      setFilesToUpload([...filesToUpload, ...newFiles]);

      // Generate previews for dropped files and combine with existing previews
      const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
      setPreviews([...previews, ...newPreviews]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const clearSelections = () => {
    // Revoke object URLs to avoid memory leaks
    previews.forEach((preview) => {
      if (preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    });
    setFilesToUpload([]);
    setPreviews([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removeFile = (index: number) => {
    const newFiles = [...filesToUpload];
    newFiles.splice(index, 1);
    setFilesToUpload(newFiles);

    const newPreviews = [...previews];
    if (newPreviews[index].startsWith("blob:")) {
      URL.revokeObjectURL(newPreviews[index]);
    }
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md sm:max-w-lg md:max-w-xl">
        <AlertDialogTitle className="text-xl font-semibold mb-4">
          Upload Media
        </AlertDialogTitle>
        <div
          className={`w-full ${
            previews.length ? "h-auto" : "h-64"
          } rounded-md mb-4 transition-all`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
        >
          {previews.length ? (
            <div className="space-y-4">
              {/* Preview grid */}
              <div className="grid grid-cols-2 gap-3 max-h-96 overflow-auto">
                {previews.map((preview, index) => (
                  <Card key={index} className="relative overflow-hidden group">
                    <CardContent className="p-1">
                      <div className="relative aspect-square w-full overflow-hidden rounded">
                        {preview.includes("video") ? (
                          <video
                            src={preview}
                            controls
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Image
                            src={preview}
                            alt={`Preview ${index}`}
                            fill
                            className="object-cover"
                          />
                        )}
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 size-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeFile(index)}
                        >
                          <X className="size-4" />
                        </Button>
                      </div>
                      <p className="text-xs truncate mt-1">
                        {filesToUpload[index]?.name}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="flex justify-center">
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="text-sm text-foreground"
                >
                  Add more files
                </Button>
              </div>
            </div>
          ) : (
            <div className="h-full border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-md flex flex-col justify-center items-center p-4 text-center gap-2">
              <ImageIcon className="size-12 text-zinc-400" />
              <p className="text-zinc-500 dark:text-zinc-400">
                Drag and drop files here or click to browse
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="mt-2 text-foreground"
              >
                Choose Files
              </Button>
            </div>
          )}
          <Input
            ref={fileInputRef}
            className="hidden"
            id="media-upload"
            type="file"
            multiple
            accept="image/*,video/*"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </div>
        <div className="w-full flex justify-end gap-3 mt-4">
          <AlertDialogCancel onClick={clearSelections} disabled={isUploading}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleUpload}
            disabled={!filesToUpload.length || isUploading}
            className="relative"
          >
            {isUploading && (
              <Loader2 className="absolute left-2  animate-spin size-4" />
            )}
            {isUploading ? "Uploading..." : "Upload"}
          </AlertDialogAction>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

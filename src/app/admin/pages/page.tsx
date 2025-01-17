import { scanPages } from "@/utils/pages";
import { Plus } from "lucide-react";
import PagePreview from "./pagePreview";

export default async function PagesPage() {
  const staticPages = scanPages();
  return (
    <div className="relative h-full overflow-hidden">
      <div className="w-full border-b flex justify-end items-center p-4">
        <Plus />
      </div>
      <div className="flex h-full">
        <PagePreview routes={staticPages} />
      </div>
    </div>
  );
}

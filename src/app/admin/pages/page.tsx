import { scanPages } from "@/utils/pages";
import { VerticalTreeMenu } from "./pagesList";
import { Plus } from "lucide-react";

export default async function PagesPage() {
  const staticPages = scanPages();

  return (
    <div className="relative h-full">
      <div className="w-full border-b flex justify-end items-center p-4">
        <Plus />
      </div>
      <VerticalTreeMenu routes={staticPages} />
    </div>
  );
}

"use server";
import { Plus } from "lucide-react";
import { simplcms } from "../../../../../core";
import PagePreview from "../../../../client/components/pagePreview";

export default async function PagesPage() {
  const allPages = await simplcms.pages.getAllPages();
  return (
    <div className="relative h-full overflow-hidden">
      <h2 className="text-3xl font-bold px-4">Pages</h2>
      <div className="w-full border-b dark:border-b-dark flex justify-end items-center p-4">
        <Plus />
      </div>
      <div className="flex h-full">
        <PagePreview routes={allPages} />
      </div>
    </div>
  );
}

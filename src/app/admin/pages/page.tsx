import { scanPages } from "@/lib/pages";
import { Plus } from "lucide-react";
import PagePreview from "./pagePreview";
import ErrorToast from "@/components/errorToast";

export default async function PagesPage() {
  try {
    const staticPages = scanPages();
    return (
      <div className="relative h-full overflow-hidden">
        <h2 className="text-3xl font-bold px-4">Pages</h2>
        <div className="w-full border-b dark:border-b-dark flex justify-end items-center p-4">
          <Plus />
        </div>
        <div className="flex h-full">
          <PagePreview routes={staticPages} />
        </div>
      </div>
    );
  } catch (error) {
    console.error(error);
    return <ErrorToast error={error} />;
  }
}

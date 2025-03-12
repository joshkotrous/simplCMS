import { getServerEnvVars, simplCms } from "@/packages/core/src/simplCms";
import { MarkdownEditor } from "./textEditor";

export default async function NewPostPage() {
  const platformConfiguration = getServerEnvVars();
  const media = await simplCms.media.getMedia(
    platformConfiguration.mediaStorage
  );
  return (
    <div className="p-4 h-full overflow-auto space-y-8">
      <h2 className="text-3xl font-bold">New Post</h2>
      <div className="flex justify-center">
        <div className="w-[44rem]">
          <MarkdownEditor media={media} />
        </div>
      </div>
    </div>
  );
}

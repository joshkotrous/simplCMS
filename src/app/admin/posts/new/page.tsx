import { MarkdownEditor } from "./textEditor";

export default async function NewPostPage() {
  return (
    <div className="p-4 h-full overflow-auto">
      <h2 className="text-3xl font-bold">New Post</h2>
      <div className="flex justify-center">
        <div className="w-[44rem]">
          <MarkdownEditor />
        </div>
      </div>
    </div>
  );
}

import { PostList } from "simplcms";
export default async function BlogPage() {
  return (
    <div className="container mx-auto max-w-5xl pt-20 px-6">
      <PostList />
    </div>
  );
}

import { SimplCMSRouter } from "simplcms";

export default function AdminPage({ params }: { params: { slug?: string[] } }) {
  return <SimplCMSRouter params={params} />;
}
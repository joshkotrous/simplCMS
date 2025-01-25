import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { redirect } from "next/navigation";
import { VercelLogo } from "@/components/logos";

export default async function HostSetupPage() {
  if (process.env.SIMPLCMS_HOST_PROVIDER) {
    redirect("/setup/vercel");
  }
  return (
    <div className="size-full flex flex-col justify-center items-center  space-y-12 text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
      </div>

      <p>Select a Host Provider</p>
      <div className="grid grid-cols-1 gap-4">
        <Link href="/setup/vercel">
          <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
            <CardContent className="p-0 ">
              <VercelLogo />
            </CardContent>
          </Card>
        </Link>
      </div>
    </div>
  );
}

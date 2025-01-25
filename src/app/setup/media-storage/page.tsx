import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { SupabaseLogo } from "../page";
import { CloudinaryLogo, AWSS3Logo } from "@/components/logos";
export default async function SetupPage() {
  return (
    <div className="size-full flex flex-col justify-center items-center  space-y-12 text-foreground">
      <div className="text-center">
        <h2 className="text-2xl font-bold">SimplCMS</h2>
        <h3 className="text-xl font-semibold">Setup </h3>
      </div>

      <p>Select a Media Storage Provider</p>
      <div className="grid grid-cols-3 gap-4 w-[44rem]">
        <Link href="/setup/media-storage/cloudinary">
          <Card className="size-full p-12 flex items-center justify-center cursor-pointer hover:scale-[99%]">
            <CardContent className="p-0 ">
              <CloudinaryLogo />
            </CardContent>
          </Card>
        </Link>

        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer text-center bg-zinc-200 text-foreground">
          <CardContent className="p-0 gap-4 flex flex-col">
            <AWSS3Logo />
            <span className="font-semibold">AWS S3</span>
          </CardContent>
        </Card>
        <Card className="size-full p-12 flex items-center justify-center hover:scale-[99%] cursor-pointer bg-zinc-200">
          <CardContent className="p-0">
            <SupabaseLogo />
            <span className="font-semibold">Supabase Storage</span>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

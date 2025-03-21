"use server";
import {
  Card,
  CardContent,
  CardHeader,
} from "../../../../client/components/ui/card";
import { IoLogoGithub } from "react-icons/io";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import Link from "next/link";
import { redirect } from "next/navigation";
export default async function SetupOauth() {
  if (process.env.SIMPLCMS_OAUTH_PROVIDERS) redirect("/setup/redeploy");

  return (
    <div className="size-full flex justify-center items-center text-simplcms-foreground">
      <Card>
        <CardHeader className="gap-4">
          <h2 className="flex w-full justify-center text-xl font-bold">
            Setup an OAuth Provider
          </h2>
        </CardHeader>
        <CardContent className="flex gap-4">
          <Link
            href="/admin/setup/oauth/google"
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <FaGoogle className="size-16" />
          </Link>
          <Link
            href="/admin/setup/oauth/github"
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <IoLogoGithub className="size-16" />
          </Link>

          <Link
            href="/admin/setup/oauth/microsoft"
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <FaMicrosoft className="size-16" />
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}

"use client";
import { Card, CardContent, CardHeader } from "@/app/components/ui/card";
import Link from "next/link";
import { IoLogoGithub } from "react-icons/io";
import { FaGoogle, FaMicrosoft } from "react-icons/fa";
import { signIn } from "next-auth/react";
import ErrorToast from "@/app/components/errorToast";

export default function AdminLoginPage() {
  try {
    return (
      <Card>
        <CardHeader className="font-bold text-lg text-center">
          <span className="text-3xl">SimplCMS</span>
          <span>Login</span>
        </CardHeader>
        <CardContent className="flex justify-evenly gap-4">
          <div
            onClick={() => signIn("google")}
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <FaGoogle className="size-16" />
          </div>
          <Link
            href=""
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <IoLogoGithub className="size-16" />
          </Link>

          <Link
            href=""
            className="border-zinc-200 rounded-lg shadow-xl border flex size-fit p-2 hover:scale-95 transition-all"
          >
            <FaMicrosoft className="size-16" />
          </Link>
        </CardContent>
      </Card>
    );
  } catch (error) {
    return <ErrorToast error={error} />;
  }
}

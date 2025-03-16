"use server";
import React from "react";
import "../../globals.css";

export default async function AdminLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className=" h-screen w-screen flex justify-center items-center bg-background bg-[linear-gradient(215deg,rgba(0,0,0,0.25)_0%,transparent_40%)] dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)]">
      {children}
    </div>
  );
}

"use server";
import { notFound, redirect } from "next/navigation";
import { AdminLayout, LoginLayout, SimplCMSLayout } from "../layouts";
import { getServerSession } from "next-auth";
import { getUserByEmail, userHasAccess } from "@/core/user";
import React from "react";
import LoginForm from "@/app/client/components/loginForm";
interface AdminRouterProps {
  params: {
    slug?: string[];
  };
}
export default async function AdminRouter({ params }: AdminRouterProps) {
  // Auth checks
  const session = await getServerSession();

  // Special case for login page to prevent redirect loop
  if (params.slug?.[0] === "login") {
    return (
      <LoginLayout>
        <LoginForm />
      </LoginLayout>
    );
  }

  // // Redirect to login if no session
  // if (!session?.user?.email) {
  //   redirect("/admin/login");
  // }

  // const user = await getUserByEmail(session.user.email);
  // if (!user) {
  //   redirect("/admin/login");
  // }

  // // Skip access check for setup page
  // if (params.slug?.[0] === "setup") {
  //   return (
  //     <AdminLayout user={user}>
  //       <SetupPage />
  //     </AdminLayout>
  //   );
  // }

  // // Check user access
  // const hasAccess = await userHasAccess(user);
  // if (!hasAccess) {
  //   // Option 1: Redirect to a specific "no access" page
  //   redirect("/admin/login?error=access");
  //   // Option 2: Or display an error message
  //   // throw new Error("User does not have access");
  // }

  // // Route handling
  // const { slug } = params;
  // let PageComponent;

  // // Base `/admin` page
  // if (!slug || slug.length === 0) {
  //   PageComponent = <AdminPage />;
  // }
  // // Posts
  // else if (slug[0] === "posts") {
  //   if (slug.length === 1) PageComponent = <PostsPage />;
  //   else if (slug[1] === "new") PageComponent = <NewPostPage />;
  //   else if (slug[1] === "drafts") PageComponent = <PostDraftsPage />;
  //   else if (slug[1] === "view")
  //     PageComponent = <ViewPostPage params={{ postId: slug[2] }} />;
  //   else PageComponent = <EditPostPage params={{ postId: slug[1] }} />;
  // }
  // // Pages
  // else if (slug[0] === "pages") {
  //   PageComponent = <PagesPage />;
  // }
  // // Media
  // else if (slug[0] === "media") {
  //   PageComponent = <MediaPage />;
  // }
  // // Settings
  // else if (slug[0] === "settings") {
  //   if (slug.length > 1 && slug[1] === "users") PageComponent = <UsersPage />;
  //   else if (slug.length > 1 && slug[1] === "connections")
  //     PageComponent = <ConnectionsPage />;
  //   else PageComponent = <SiteSettingsPage />;
  // }
  // // Setup - already handled above
  // // 404 fallback
  // else {
  //   return notFound();
  // }

  // return <SimplCMSLayout user={user}>{PageComponent}</SimplCMSLayout>;
}

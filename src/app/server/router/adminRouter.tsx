"use server";
import { notFound, redirect } from "next/navigation";
import { AdminLayout, LoginLayout, SimplCMSLayout } from "../layouts";
import { getServerSession } from "next-auth";
import { getUserByEmail, userHasAccess } from "@/core/user";
import React from "react";
import LoginForm from "@/app/client/components/loginForm";
import PostsPage from "../pages/admin/posts/postsPage";
import NewPostPage from "../pages/admin/posts/newPostPage";
import DraftsPage from "../pages/admin/posts/postDraftsPage";
import EditPostPage from "../pages/admin/posts/editPostPage";
import PagesPage from "../pages/admin/pages/pagesPage";
import AdminMediaPage from "../pages/admin/media/mediaPage";
import ConnectionSettings from "../pages/admin/settings/connectionsPage";
import SiteSettings from "../pages/admin/settings/sitePage";
import UserSettingsPage from "../pages/admin/settings/usersPage";
import SetupPage from "../pages/setup/setupPage";
import PostPage from "../pages/admin/posts/viewPostPage";
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

  // Redirect to login if no session
  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  const user = await getUserByEmail(session.user.email);
  if (!user) {
    redirect("/admin/login");
  }

  // Skip access check for setup page
  if (params.slug?.[0] === "setup") {
    return (
      <AdminLayout user={user}>
        <SetupPage />
      </AdminLayout>
    );
  }

  // Check user access
  const hasAccess = await userHasAccess(user);
  if (!hasAccess) {
    // Option 1: Redirect to a specific "no access" page
    redirect("/admin/login?error=access");
    // Option 2: Or display an error message
    // throw new Error("User does not have access");
  }

  // Route handling
  const { slug } = params;
  let PageComponent;

  // Base `/admin` page
  if (!slug || slug.length === 0) {
    PageComponent = <PostsPage />;
  }
  // Posts
  else if (slug[0] === "posts") {
    if (slug.length === 1) PageComponent = <PostsPage />;
    else if (slug[1] === "new") PageComponent = <NewPostPage />;
    else if (slug[1] === "drafts") PageComponent = <DraftsPage />;
    // Handle edit post route: /admin/posts/[postId]/edit
    else if (slug.length === 3 && slug[2] === "edit") {
      PageComponent = <EditPostPage params={{ postId: slug[1] }} />;
    } else PageComponent = <PostPage params={{ postId: slug[1] }} />;
  }
  // Pages
  else if (slug[0] === "pages") {
    PageComponent = <PagesPage />;
  }
  // Media
  else if (slug[0] === "media") {
    PageComponent = <AdminMediaPage />;
  }
  // Settings
  else if (slug[0] === "settings") {
    if (slug.length > 1 && slug[1] === "users")
      PageComponent = <UserSettingsPage />;
    else if (slug.length > 1 && slug[1] === "connections")
      PageComponent = <ConnectionSettings />;
    else PageComponent = <SiteSettings />;
  }
  // Setup - already handled above
  // 404 fallback
  else {
    return notFound();
  }

  return (
    <SimplCMSLayout user={user}>
      <AdminLayout user={user}>{PageComponent}</AdminLayout>
    </SimplCMSLayout>
  );
}

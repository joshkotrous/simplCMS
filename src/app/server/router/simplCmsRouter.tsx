"use server";
import { notFound, redirect } from "next/navigation";
import {
  AdminLayout,
  LoginLayout,
  SetupLayout,
  SimplCMSLayout,
} from "../layouts";
import { getServerSession } from "next-auth";
import React from "react";
import LoginForm from "../../client/components/loginForm";
import PostsPage from "../pages/admin/posts/postsPage";
import NewPostPage from "../pages/admin/posts/newPostPage";
import DraftsPage from "../pages/admin/posts/postDraftsPage";
import EditPostPage from "../pages/admin/posts/editPostPage";
import PagesPage from "../pages/admin/pages/pagesPage";
import AdminMediaPage from "../pages/admin/media/mediaPage";
import ConnectionSettings from "../pages/admin/settings/connectionsPage";
import SiteSettings from "../pages/admin/settings/sitePage";
import UserSettingsPage from "../pages/admin/settings/usersPage";
import PostPage from "../pages/admin/posts/viewPostPage";
import SetupRouter from "./setupRouter";
import { simplcms } from "../../../core";
export interface SimplCMSRouterProps {
  params: {
    slug?: string[];
  };
}
export default async function SimplCMSRouter({ params }: SimplCMSRouterProps) {
  // Auth checks
  const session = await getServerSession();
  const user = session?.user?.email
    ? await simplcms.users.getUserByEmail(session.user.email)
    : null;

  if (params.slug?.[0] === "login") {
    return (
      <SimplCMSLayout>
        <LoginLayout user={user}>
          <LoginForm />
        </LoginLayout>
      </SimplCMSLayout>
    );
  }

  if (!session?.user?.email) {
    redirect("/admin/login");
  }

  if (!user) {
    redirect("/admin/login");
  }

  // Skip access check for setup page
  if (params.slug?.[0] === "setup") {
    return SetupRouter(params.slug, user);
  }

  // Check user access
  const hasAccess = await simplcms.users.userHasAccess(user);
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
  } else {
    return notFound();
  }

  return (
    <SimplCMSLayout user={user}>
      <AdminLayout user={user}>{PageComponent}</AdminLayout>
    </SimplCMSLayout>
  );
}

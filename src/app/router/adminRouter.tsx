// src/app/pages/admin/adminRouter.tsx (inside your package)
"use client";

import { useRouter } from "next/router";
import { AdminLayout } from "../layouts";
import {
  AdminPage,
  ConnectionsPage,
  EditPostPage,
  LoginPage,
  MediaPage,
  NewPostPage,
  PagesPage,
  PostDraftsPage,
  PostsPage,
  SetupPage,
  SiteSettingsPage,
  UsersPage,
  ViewPostPage,
} from "../pages";

export default function SimplCmsRouter() {
  const router = useRouter();
  const { slug } = router.query;

  let PageComponent;

  // Base `/admin` page
  if (!slug) {
    PageComponent = <AdminPage />;
  }
  // Posts
  else if (slug[0] === "posts") {
    if (slug.length === 1) PageComponent = <PostsPage />;
    else if (slug[1] === "new") PageComponent = <NewPostPage />;
    else if (slug[1] === "drafts") PageComponent = <PostDraftsPage />;
    else if (slug[1] === "view")
      PageComponent = <ViewPostPage params={{ postId: slug[1] }} />;
    else PageComponent = <EditPostPage params={{ postId: slug[1] }} />;
  }
  // Pages
  else if (slug[0] === "pages") {
    PageComponent = <PagesPage />;
  }
  // Media
  else if (slug[0] === "media") {
    PageComponent = <MediaPage />;
  }
  // Settings
  else if (slug[0] === "settings") {
    if (slug[1] === "users") PageComponent = <UsersPage />;
    else if (slug[1] === "connections") PageComponent = <ConnectionsPage />;
    else PageComponent = <SiteSettingsPage />;
  }
  // Login
  else if (slug[0] === "login") {
    PageComponent = <LoginPage />;
  }
  // Setup
  else if (slug[0] === "setup") {
    PageComponent = <SetupPage />;
  }
  // 404 fallback
  else {
    PageComponent = <div className="p-4">404 Not Found</div>;
  }

  return <AdminLayout>{PageComponent}</AdminLayout>;
}

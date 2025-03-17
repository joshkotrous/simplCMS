"use client";
import { BookOpenText, Image, PencilLine, Settings } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from "./ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import Link from "next/link";
import UserMenu from "./userMenu";
import { User } from "../../../types/types";

export default function AdminSidebar({ user }: { user: User }) {
  const { open } = useSidebar();
  return (
    <Sidebar
      collapsible="icon"
      className="border-zinc-200 dark:border-zinc-700"
    >
      <SidebarContent className="bg-background list-none  bg-[linear-gradient(215deg,rgba(0,0,0,0.1)_0%,transparent_40%)] dark:bg-[linear-gradient(215deg,rgba(255,255,255,0.1)_0%,transparent_40%)] justify-between ">
        <div>
          {open && (
            <SidebarHeader>
              <Link href="/admin" className="text-xl font-bold">
                SimplCMS
              </Link>
            </SidebarHeader>
          )}

          <SidebarGroup>
            <SidebarGroupContent>
              <SidebarMenuItem>
                <Link href="/admin/pages">
                  <SidebarMenuButton>
                    <BookOpenText /> Pages
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/posts list-none">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <PencilLine />
                      Posts
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/admin/posts">
                          Published
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/admin/posts/drafts">
                          Drafts
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
              <SidebarMenuItem>
                <Link href="/admin/media">
                  <SidebarMenuButton>
                    <Image /> Media
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
              <Collapsible defaultOpen className="group/posts">
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton>
                      <Settings />
                      Settings
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/admin/settings/site">
                          Site
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/admin/settings/users">
                          Users
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                      <SidebarMenuSubItem>
                        <SidebarMenuSubButton href="/admin/settings/connections">
                          Connections
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <SidebarFooter className="list-none bg-transparent">
          <SidebarMenuAction asChild>
            <UserMenu user={user} />
          </SidebarMenuAction>
        </SidebarFooter>
      </SidebarContent>
    </Sidebar>
  );
}

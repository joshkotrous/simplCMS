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
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";
import { UserType } from "@/types/types";
import UserMenu from "./userMenu";

export default function AdminSidebar({ user }: { user: UserType }) {
  const { open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarContent className="bg-background list-none">
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
      </SidebarContent>
      <SidebarFooter className="list-none bg-background">
        <SidebarMenuAction asChild>
          <UserMenu user={user} />
        </SidebarMenuAction>
      </SidebarFooter>
    </Sidebar>
  );
}

"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BarChart3, LayoutDashboard, Music, Users } from "lucide-react";
import Link from "next/link";
import { NavItem } from "./nav-item";
import { useSession } from "next-auth/react";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Overview" },
  { href: "/dashboard/top-tracks", icon: Music, label: "Top Tracks" },
  { href: "/dashboard/top-artists", icon: Users, label: "Top Artists" },
  { href: "/dashboard/history", icon: BarChart3, label: "History" },
];

export function AppSidebar() {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Sidebar
      variant="sidebar"
      collapsible="icon"
      className="border-sidebar-border"
    >
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2 overflow-hidden"
        >
          <div className="bg-primary rounded-lg p-1.5 text-primary-foreground">
            <Music className="size-5" />
          </div>
          <span className="text-lg font-semibold whitespace-nowrap">
            Muse Insights
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <NavItem href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </NavItem>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <Separator className="mx-2 my-1 w-auto bg-sidebar-border" />

      <SidebarFooter>
        <div className="flex items-center gap-3 overflow-hidden">
          <Avatar className="size-8">
            <AvatarImage src={user?.image || undefined} alt={user?.name || ""} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-sm">
            <span className="font-semibold text-foreground truncate">
              {user?.name}
            </span>
            <span className="text-muted-foreground truncate">{user?.email}</span>
          </div>
        </div>
        <div className="text-xs text-muted-foreground text-center px-2 pt-4 group-data-[collapsible=icon]:hidden">
          Developed by{" "}
          <a
            href="https://github.com/Rovindu-Thamuditha"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-foreground"
          >
            Rovindu Thamuditha
          </a>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

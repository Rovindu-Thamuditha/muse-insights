"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";

type NavItemProps = ComponentProps<typeof Link> & {
  children: React.ReactNode;
};

export function NavItem({ href, children, ...props }: NavItemProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <SidebarMenuButton
      asChild
      isActive={isActive}
      tooltip={{
        children: children,
        className: "capitalize",
      }}
    >
      <Link href={href} {...props}>
        {children}
      </Link>
    </SidebarMenuButton>
  );
}

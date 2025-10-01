"use client";

import { Header } from "@/components/app/header";
import { AppSidebar } from "@/components/app/sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-1 p-4 md:p-6">{children}</main>
          <footer className="p-4 text-center text-xs text-muted-foreground">
            Developed by{" "}
            <a
              href="https://github.com/Rovindu-Thamuditha"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-foreground font-semibold"
            >
              Rovindu Thamuditha
            </a>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

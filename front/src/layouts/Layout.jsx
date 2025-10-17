import React from "react";
import { SidebarProvider, SidebarTrigger } from "../components/ui/sidebar.tsx";
import { AppSidebar } from "../components/app-sidebar.tsx";
import { Outlet } from "react-router-dom";

import "../styles/globals.css"

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 min-w-0 bg-background transition-all duration-200">
          <SidebarTrigger />
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  );
}

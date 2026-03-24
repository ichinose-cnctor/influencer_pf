"use client";

import { useSidebar } from "./SidebarContext";

export function SidebarOverlay() {
  const { sidebarOpen, setSidebarOpen } = useSidebar();

  if (!sidebarOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[35] bg-black/50 lg:hidden"
      onClick={() => setSidebarOpen(false)}
    />
  );
}

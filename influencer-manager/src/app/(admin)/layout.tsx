import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { NotificationProvider } from "@/components/layout/NotificationContext";
import { NotificationPanel } from "@/components/layout/NotificationPanel";
import { AccountProvider } from "@/components/layout/AccountContext";
import { SidebarProvider } from "@/components/layout/SidebarContext";
import { SidebarOverlay } from "@/components/layout/SidebarOverlay";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AccountProvider>
      <NotificationProvider>
        <SidebarProvider>
          <div className="min-h-screen bg-background">
            <Sidebar />
            <SidebarOverlay />
            <NotificationPanel />
            <main className="lg:ml-60 min-h-screen flex flex-col">
              <Header />
              <div className="p-4 sm:p-6 flex-1">{children}</div>
              <Footer />
            </main>
          </div>
        </SidebarProvider>
      </NotificationProvider>
    </AccountProvider>
  );
}

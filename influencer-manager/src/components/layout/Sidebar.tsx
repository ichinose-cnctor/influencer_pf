"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Megaphone,
  FolderOpen,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { useNotification } from "./NotificationContext";
import { useAccount } from "./AccountContext";
import { useSidebar } from "./SidebarContext";
import { useAuth } from "@/lib/AuthContext";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { open, setOpen, unreadCount } = useNotification();
  const { name, photoUrl } = useAccount();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    router.push("/admin/login");
  };

  const isActive = (href: string) => pathname === href;
  const isDashboardActive = pathname === "/admin/dashboard";
  const isProjectActive = pathname.startsWith("/admin/campaigns") && !pathname.startsWith("/admin/campaigns/new");
  const isCampaignNewActive = pathname.startsWith("/admin/campaigns/new");
  const isAnnouncementActive = pathname.startsWith("/admin/announcements");

  const handleNavClick = () => {
    setSidebarOpen(false);
  };

  return (
    <aside
      className={cn(
        "fixed top-0 z-40 h-screen w-60 bg-card flex flex-col transition-transform duration-300",
        // モバイル: 右側からスライド
        "right-0 border-l border-border",
        // デスクトップ(lg以上): 左側に固定表示
        "lg:left-0 lg:right-auto lg:border-l-0 lg:border-r",
        sidebarOpen ? "translate-x-0" : "translate-x-full",
        "lg:translate-x-0"
      )}
    >
      {/* ロゴ */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-border">
        <div className="flex h-8 w-8 items-center justify-center shrink-0">
          <img src="/logo.png" alt="logo" className="h-8 w-8 object-contain" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-bold text-foreground">Influencer</p>
          <p className="text-xs text-muted-foreground">Manager</p>
        </div>
      </div>

      {/* 案件作成ボタン */}
      <div className="px-3 py-3 border-b border-border space-y-2">
        <Link
          href="/admin/campaigns/new"
          onClick={handleNavClick}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-lg border border-violet-300 text-sm font-medium py-2.5 transition-colors",
            isCampaignNewActive
              ? "bg-violet-600 text-white border-violet-600"
              : "text-violet-600 hover:bg-violet-600 hover:text-white hover:border-violet-600"
          )}
        >
          <Plus className="h-4 w-4" />
          案件を作成する
        </Link>
        <Link
          href="/admin/announcements/new"
          onClick={handleNavClick}
          className={cn(
            "flex items-center justify-center gap-2 w-full rounded-lg border border-violet-300 text-sm font-medium py-2.5 transition-colors",
            isAnnouncementActive
              ? "bg-violet-600 text-white border-violet-600"
              : "text-violet-600 hover:bg-violet-600 hover:text-white hover:border-violet-600"
          )}
        >
          <Megaphone className="h-4 w-4" />
          お知らせを作成する
        </Link>
      </div>

      {/* メインナビゲーション */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <p className="px-3 mb-2 text-[12px] lg:text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
          メニュー
        </p>

        {/* ダッシュボード */}
        <Link
          href="/admin/dashboard"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isDashboardActive
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <LayoutDashboard className="h-4 w-4 shrink-0" />
          <span className="flex-1">ダッシュボード</span>
        </Link>

        {/* プロジェクト管理 */}
        <Link
          href="/admin/campaigns"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isProjectActive
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <FolderOpen className="h-4 w-4 shrink-0" />
          <span className="flex-1">プロジェクト管理</span>
        </Link>

        {/* インフルエンサー */}
        <Link
          href="/admin/influencers"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/admin/influencers")
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Users className="h-4 w-4 shrink-0" />
          <span className="flex-1">インフルエンサー</span>
        </Link>

        {/* メッセージ */}
        <Link
          href="/admin/messages"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/admin/messages")
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <MessageSquare className="h-4 w-4 shrink-0" />
          <span className="flex-1">メッセージ</span>
          <Badge className="h-5 min-w-5 px-1.5 text-[12px] lg:text-[10px] bg-violet-100 text-violet-700 border-violet-200">
            3
          </Badge>
        </Link>
      </nav>

      {/* ボトムナビゲーション */}
      <div className="border-t border-border px-3 py-4 space-y-1">
        {/* 通知 */}
        <button
          onClick={() => { setOpen(!open); setSidebarOpen(false); }}
          className={cn(
            "w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            open
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Bell className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">通知</span>
          {unreadCount > 0 && (
            <Badge className="h-5 min-w-5 px-1.5 text-[12px] lg:text-[10px] bg-rose-100 text-rose-700 border-rose-200">
              {unreadCount}
            </Badge>
          )}
        </button>

        {/* 設定 */}
        <Link
          href="/admin/settings"
          onClick={handleNavClick}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
            isActive("/admin/settings")
              ? "bg-violet-600 text-white"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          <Settings className="h-4 w-4 shrink-0" />
          <span className="flex-1">設定</span>
        </Link>

        {/* ユーザーアバター */}
        <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2.5">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-violet-400 to-pink-400 flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
            {photoUrl ? (
              <img src={photoUrl} alt="profile" className="h-full w-full object-cover" />
            ) : (
              name.charAt(0)
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate text-foreground">{name}</p>
            <p className="text-[12px] lg:text-[10px] truncate text-muted-foreground">管理者</p>
          </div>
          <button
            className="lg:hidden p-1.5 text-muted-foreground hover:text-foreground transition-colors shrink-0"
            aria-label="ログアウト"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  );
}

"use client";

import { usePathname } from "next/navigation";
import { Bell, HelpCircle, BookOpen, LogOut, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { useRef } from "react";
import { useNotification } from "./NotificationContext";
import { useAccount } from "./AccountContext";
import { useSidebar } from "./SidebarContext";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/admin/dashboard": { title: "ダッシュボード", subtitle: "案件の進捗状況を確認できます" },
  "/admin/campaigns": { title: "プロジェクト管理", subtitle: "案件の一覧・進捗管理" },
  "/admin/campaigns/new": { title: "案件作成", subtitle: "" },
  "/admin/campaigns/new/requirements": { title: "案件作成", subtitle: "" },
  "/admin/influencers": { title: "インフルエンサー", subtitle: "登録済みインフルエンサーの一覧" },
  "/admin/messages": { title: "メッセージ", subtitle: "" },
  "/admin/notifications": { title: "通知", subtitle: "最新のお知らせ" },
  "/admin/settings": { title: "設定", subtitle: "アカウント・システム設定" },
  "/admin/announcements/new": { title: "お知らせを作成", subtitle: "" },
  "/admin/announcements/new/confirm": { title: "お知らせを作成", subtitle: "" },
};

export function Header() {
  const pathname = usePathname();
  const { open, setOpen, unreadCount } = useNotification();
  const { name } = useAccount();
  const { sidebarOpen, setSidebarOpen } = useSidebar();
  const bellRef = useRef<HTMLButtonElement>(null);

  const isCampaignDetail = pathname.startsWith("/admin/campaigns/") && !pathname.startsWith("/admin/campaigns/new");
  const isAnnouncementDetail = pathname.startsWith("/admin/announcements/") && !pathname.startsWith("/admin/announcements/new");
  const pageInfo = pageTitles[pathname] ?? (
    isCampaignDetail
      ? { title: "案件詳細", subtitle: "案件の契約内容・チャット・支払い状況" }
      : isAnnouncementDetail
      ? { title: "お知らせ詳細", subtitle: "" }
      : { title: "ページ", subtitle: "" }
  );

  return (
    <header className="sticky top-0 z-30 h-12 lg:h-16 w-full lg:border-b lg:border-border bg-background flex items-center px-4 sm:px-6 gap-3">
      {/* タイトル */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-foreground leading-tight truncate">{pageInfo.title}</h1>
        <p className="text-xs text-muted-foreground hidden sm:block">{pageInfo.subtitle}</p>
      </div>

      {/* ヘルプ（sm以上のみ） */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex">
            <HelpCircle className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ヘルプ</TooltipContent>
      </Tooltip>

      {/* FAQ（sm以上のみ） */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hidden sm:flex">
            <BookOpen className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>FAQ</TooltipContent>
      </Tooltip>

      {/* 通知ボタン（PC：FAQの右横） */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            ref={bellRef}
            variant="ghost"
            size="icon"
            className="relative h-9 w-9 text-muted-foreground hover:text-foreground hidden lg:flex"
            onClick={() => setOpen(!open)}
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-rose-500" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>新着情報</TooltipContent>
      </Tooltip>

      {/* セパレーター */}
      <div className="h-6 w-px bg-border mx-1 hidden sm:block" />

      {/* アカウント名（sm以上のみ） */}
      <div className="hidden sm:flex flex-col leading-tight">
        <span className="text-sm font-medium text-foreground">{name}</span>
        <span className="text-xs text-muted-foreground">levgo_sns@cnctor.jp</span>
      </div>

      {/* ログアウト（lg以上のみ） */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-foreground hidden lg:flex">
            <LogOut className="h-4 w-4" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>ログアウト</TooltipContent>
      </Tooltip>

      {/* 通知ボタン（モバイル：ハンバーガーの左） */}
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className="relative h-12 w-12 lg:h-9 lg:w-9 text-muted-foreground hover:text-foreground lg:hidden"
            onClick={() => setOpen(!open)}
          >
            <Bell className="!h-[22px] !w-[22px] lg:!h-4 lg:!w-4" />
            {unreadCount > 0 && (
              <span className="absolute right-0.5 top-0.5 h-2.5 w-2.5 rounded-full bg-rose-500 lg:right-1.5 lg:top-1.5 lg:h-2 lg:w-2" />
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>新着情報</TooltipContent>
      </Tooltip>

      {/* ハンバーガーボタン（lg未満のみ・通知の右） */}
      <Button
        variant="ghost"
        className="h-12 w-12 lg:h-9 lg:w-9 text-muted-foreground hover:text-foreground lg:hidden shrink-0"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="メニューを開く"
      >
        <Menu className="!h-[22px] !w-[22px] lg:!h-5 lg:!w-5" />
      </Button>
    </header>
  );
}

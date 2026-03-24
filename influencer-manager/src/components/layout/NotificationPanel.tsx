"use client";

import { useEffect, useState } from "react";
import { X, Bell } from "lucide-react";
import { useNotification, NotificationType } from "./NotificationContext";
import { cn } from "@/lib/utils";

const TYPE_LABELS: Record<NotificationType, string> = {
  influencer: "インフルエンサー",
  application: "応募",
  message: "メッセージ",
  cancellation: "キャンセル",
};

const TYPE_COLORS: Record<NotificationType, string> = {
  influencer: "bg-sky-100 text-sky-700",
  application: "bg-emerald-100 text-emerald-700",
  message: "bg-violet-100 text-violet-700",
  cancellation: "bg-rose-100 text-rose-700",
};

export function NotificationPanel() {
  const { open, setOpen, notifications, setNotifications } = useNotification();
  const [filters, setFilters] = useState<Record<NotificationType, boolean>>({
    influencer: true,
    application: true,
    message: true,
    cancellation: true,
  });
  const [unreadOnly, setUnreadOnly] = useState(false);

  const filtered = notifications.filter((n) => {
    if (!filters[n.type]) return false;
    if (unreadOnly && n.read) return false;
    return true;
  });

  const markAsRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const toggleFilter = (type: NotificationType) => {
    setFilters((prev) => ({ ...prev, [type]: !prev[type] }));
  };

  // body スクロールロック
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      {/* バックドロップ */}
      <div
        className={cn(
          "fixed inset-0 bg-black/40 z-40 transition-opacity duration-300",
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setOpen(false)}
      />

      {/* 通知パネル（モバイル:上から／PC:右から） */}
      <aside
        className={cn(
          "fixed z-50 bg-card flex flex-col transition-transform duration-300 overflow-hidden",
          // モバイル: top-0 起点で全幅スライドダウン（top-0にすることで-translate-y-fullで完全に画面外へ）
          "top-0 left-0 right-0 w-full max-h-[80vh] rounded-b-2xl border-b border-x border-border",
          // PC: 右からスライドイン・フルハイト
          "lg:left-auto lg:right-0 lg:w-96 lg:h-screen lg:max-h-none lg:rounded-none lg:border-b-0 lg:border-x-0 lg:border-l",
          open
            ? "translate-y-0 lg:translate-x-0 pointer-events-auto shadow-xl"
            : "-translate-y-full lg:translate-y-0 lg:translate-x-full pointer-events-none lg:pointer-events-auto shadow-none"
        )}
      >
        {/* ヘッダー（アプリヘッダーと同じ h-12） */}
        <div className="flex items-center gap-2.5 px-4 h-12 shrink-0 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-50 shrink-0">
            <Bell className="h-3.5 w-3.5 text-violet-600" />
          </div>
          <div className="flex-1 leading-tight">
            <p className="text-sm font-semibold text-foreground">通知</p>
          </div>
          <button
            onClick={() => setOpen(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-lg hover:bg-accent"
            aria-label="閉じる"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* フィルター・操作 */}
        <div className="px-4 py-3 border-b border-border space-y-2.5">
          <div className="flex items-center justify-between">
            <button
              onClick={markAllAsRead}
              className="text-xs text-violet-600 hover:text-violet-800 font-medium transition-colors"
            >
              全て既読にする
            </button>
            <label className="flex items-center gap-1.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(e) => setUnreadOnly(e.target.checked)}
                className="h-3.5 w-3.5 accent-violet-600"
              />
              <span className="text-xs text-muted-foreground">未読のみ</span>
            </label>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {(Object.keys(filters) as NotificationType[]).map((type) => (
              <button
                key={type}
                onClick={() => toggleFilter(type)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-colors border",
                  filters[type]
                    ? "bg-violet-600 text-white border-violet-600"
                    : "bg-background text-muted-foreground border-border hover:border-violet-300"
                )}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>
        </div>

        {/* 通知リスト */}
        <div className="overflow-y-auto flex-1 py-2">
          {filtered.length === 0 ? (
            <div className="py-10 text-center text-sm text-muted-foreground">通知はありません</div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "px-4 py-3 border-b border-border last:border-0 transition-colors",
                  n.read ? "bg-card" : "bg-violet-50/60"
                )}
              >
                <div className="flex items-start gap-2 mb-1.5">
                  {!n.read && (
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-violet-500 shrink-0" />
                  )}
                  <p className={cn(
                    "text-sm lg:text-xs leading-snug flex-1",
                    n.read ? "text-muted-foreground" : "text-foreground font-medium"
                  )}>
                    {n.title}
                  </p>
                </div>
                <div className="flex items-center justify-between pl-3.5">
                  <div className="flex items-center gap-2">
                    <span className={cn("text-[12px] lg:text-[10px] font-medium px-2 py-0.5 rounded-full", TYPE_COLORS[n.type])}>
                      {TYPE_LABELS[n.type]}
                    </span>
                    <span className="text-[12px] lg:text-[10px] text-muted-foreground">{n.date}</span>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markAsRead(n.id)}
                      className="text-[12px] lg:text-[10px] text-violet-500 hover:text-violet-700 font-medium transition-colors"
                    >
                      既読にする
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </aside>
    </>
  );
}

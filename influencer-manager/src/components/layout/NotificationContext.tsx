"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type NotificationType = "influencer" | "application" | "message" | "cancellation";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  date: string;
  read: boolean;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, type: "influencer", title: "新規インフルエンサーが登録しました。", date: "2026/03/13", read: false },
  { id: 2, type: "application", title: "案件『春の美容コスメPR』に新規応募がありました。", date: "2026/03/12", read: false },
  { id: 3, type: "message", title: "新規メッセージが届きました。", date: "2026/03/12", read: false },
  { id: 7, type: "cancellation", title: "案件「春の美容コスメPR」の応募にキャンセルがありました。", date: "2026/03/13", read: false },
  { id: 4, type: "influencer", title: "新規インフルエンサーが登録しました。", date: "2026/03/11", read: true },
  { id: 5, type: "application", title: "案件『夏のスキンケアPR』に新規応募がありました。", date: "2026/03/10", read: true },
  { id: 6, type: "message", title: "新規メッセージが届きました。", date: "2026/03/09", read: true },
];

interface NotificationContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  unreadCount: number;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider value={{ open, setOpen, notifications, setNotifications, unreadCount }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

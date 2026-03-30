"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { notificationApi } from "@/lib/api";

export type NotificationType = "influencer" | "application" | "message" | "cancellation";

export interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  date: string;
  read: boolean;
}

interface NotificationContextValue {
  open: boolean;
  setOpen: (v: boolean) => void;
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  unreadCount: number;
  refreshNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const refreshNotifications = async () => {
    try {
      const data = await notificationApi.list();
      const mapped: Notification[] = data.map((n) => ({
        id: n.id,
        type: (n.type as NotificationType) || "application",
        title: n.title,
        date: new Date(n.created_at).toLocaleDateString("ja-JP"),
        read: n.is_read,
      }));
      setNotifications(mapped);
    } catch (err) {
      console.error("Failed to fetch notifications", err);
    }
  };

  useEffect(() => {
    refreshNotifications();
    // Refresh every 60s for "real-time" feel
    const interval = setInterval(refreshNotifications, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <NotificationContext.Provider value={{ open, setOpen, notifications, setNotifications, unreadCount, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error("useNotification must be used within NotificationProvider");
  return ctx;
}

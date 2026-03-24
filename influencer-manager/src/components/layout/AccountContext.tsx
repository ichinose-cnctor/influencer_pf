"use client";

import { createContext, useContext, ReactNode } from "react";
import { useAuth } from "@/lib/AuthContext";
import { authApi } from "@/lib/api";

interface AccountContextValue {
  name: string;
  setName: (v: string) => void;
  photoUrl: string | null;
  setPhotoUrl: (v: string | null) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const { user, refreshUser } = useAuth();

  const name = user?.name ?? "ゲスト";
  const photoUrl = user?.photo_url ?? null;

  const setName = async (v: string) => {
    try {
      await authApi.updateMe({ name: v });
      await refreshUser();
    } catch {
      // Silently fail — settings page handles errors
    }
  };

  const setPhotoUrl = async (v: string | null) => {
    try {
      await authApi.updateMe({ photo_url: v });
      await refreshUser();
    } catch {
      // Silently fail
    }
  };

  return (
    <AccountContext.Provider value={{ name, setName, photoUrl, setPhotoUrl }}>
      {children}
    </AccountContext.Provider>
  );
}

export function useAccount() {
  const ctx = useContext(AccountContext);
  if (!ctx) throw new Error("useAccount must be used within AccountProvider");
  return ctx;
}

"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface AccountContextValue {
  name: string;
  setName: (v: string) => void;
  photoUrl: string | null;
  setPhotoUrl: (v: string | null) => void;
}

const AccountContext = createContext<AccountContextValue | null>(null);

export function AccountProvider({ children }: { children: ReactNode }) {
  const [name, setNameState] = useState("田中 太郎");
  const [photoUrl, setPhotoUrlState] = useState<string | null>(null);

  useEffect(() => {
    const storedName = localStorage.getItem("account-name");
    const storedPhoto = localStorage.getItem("account-photo");
    if (storedName) setNameState(storedName);
    if (storedPhoto) setPhotoUrlState(storedPhoto);
  }, []);

  const setName = (v: string) => {
    setNameState(v);
    localStorage.setItem("account-name", v);
  };

  const setPhotoUrl = (v: string | null) => {
    setPhotoUrlState(v);
    if (v) localStorage.setItem("account-photo", v);
    else localStorage.removeItem("account-photo");
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

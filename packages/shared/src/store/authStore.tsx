import React from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type User = {
  id: string;
  name: string;
  email?: string;
  role: "owner" | "guest";
};

type AuthState = {
  user: User | null;
  isOwner: boolean;
  login: (password: string) => Promise<boolean>;
  logout: () => void;
};

const OWNER_PASS = import.meta.env.VITE_OWNER_PASS;
const OWNER_NAME = import.meta.env.VITE_OWNER_NAME ?? "Owner";
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL ?? undefined;

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      get isOwner() {
        return get().user?.role === "owner";
      },
      login: async (pw) => {
        if (!OWNER_PASS) {
          console.warn("VITE_OWNER_PASS 미설정. 임시로 게스트만 허용.");
          return false;
        }
        if (pw === OWNER_PASS) {
          set({
            user: {
              id: "owner",
              name: OWNER_NAME,
              email: OWNER_EMAIL,
              role: "owner",
            },
          });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    { name: "auth:v1" }
  )
);

/** 오너만 접근 허용 */
export function RequireOwner({
  children,
  fallback,
}: React.PropsWithChildren<{ fallback?: React.ReactNode }>) {
  const isOwner = useAuth((s) => s.isOwner);
  if (!isOwner)
    return <div>{fallback ?? <div className="p-6">403 Forbidden</div>}</div>;
  return <>{children}</>;
}

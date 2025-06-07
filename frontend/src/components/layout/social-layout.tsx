"use client";

import { ReactNode } from "react";
import { TopNavbar } from "../navigation/top-navbar";
import { BottomBar } from "../navigation/bottom-bar";

interface SocialLayoutProps {
  children: ReactNode;
}

export function SocialLayout({ children }: SocialLayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <TopNavbar />
      <main className="flex-1 pb-16 md:pb-0 pt-16">{children}</main>
      <BottomBar />
    </div>
  );
}

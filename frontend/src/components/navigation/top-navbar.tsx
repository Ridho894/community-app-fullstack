"use client";

import Link from "next/link";
// import { Bell } from "lucide-react";
// import { Button } from "../ui/button";
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "../ui/tooltip";
import { NotificationBell } from "../ui/notification/notification-bell";
import { Button } from "../ui/button";
import { UserIcon } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export function TopNavbar() {
  const { isAuthenticated } = useAuth();
  return (
    <header className="max-w-[600px] mx-auto h-16 fixed top-0 inset-x-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="font-bold text-xl">
          Community App
        </Link>

        <div className="flex items-center gap-2">
          {!isAuthenticated && (
            <Link href="/auth/login">
              <Button variant="ghost" size="icon">
                <UserIcon className="h-5 w-5" />
              </Button>
            </Link>
          )}
          <NotificationBell />
        </div>
        {/* <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Notifications</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
      </div>
    </header>
  );
}

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

export function TopNavbar() {
  return (
    <header className="max-w-[600px] mx-auto h-16 fixed top-0 inset-x-0 z-50 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 shadow-sm">
      <div className="container h-full mx-auto px-4 flex items-center justify-between">
        {/* Logo / App Name */}
        <Link href="/" className="font-bold text-xl">
          Community App
        </Link>

        {/* Right Side - Notification Icon */}
        <NotificationBell />
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

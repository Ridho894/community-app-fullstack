"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, PlusCircle, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  label: string;
  isActive: boolean;
}

export function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="max-w-[600px] mx-auto fixed bottom-0 inset-x-0 z-50 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="h-full grid grid-cols-4">
        <NavItem
          href="/"
          icon={Home}
          label="Home"
          isActive={pathname === "/"}
        />
        <NavItem
          href="/search"
          icon={Search}
          label="Search"
          isActive={pathname === "/search"}
        />
        <NavItem
          href="/create"
          icon={PlusCircle}
          label="Create"
          isActive={pathname === "/create"}
        />
        <NavItem
          href="/profile"
          icon={User}
          label="Profile"
          isActive={pathname === "/profile"}
        />
      </div>
    </nav>
  );
}

function NavItem({ href, icon: Icon, label, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center",
        isActive
          ? "text-blue-500"
          : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
      )}
    >
      <Icon className="h-6 w-6" />
      <span className="text-xs mt-1">{label}</span>
    </Link>
  );
}

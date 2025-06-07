"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  MessageSquare,
  Settings,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

interface NavItemProps {
  href: string;
  icon: React.ElementType;
  title: string;
  isActive: boolean;
}

export default function AdminSidebar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-primary text-primary-foreground"
        onClick={toggleSidebar}
        aria-label={isOpen ? "Close sidebar" : "Open sidebar"}
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 w-64 flex-shrink-0 flex flex-col",
          "fixed md:sticky top-0 left-0 h-screen z-40 transform transition-transform duration-200 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold">Admin Portal</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <ul className="space-y-1">
            <NavItem
              href="/admin"
              icon={LayoutDashboard}
              title="Dashboard"
              isActive={pathname === "/admin"}
            />
            <NavItem
              href="/admin/users"
              icon={Users}
              title="Users"
              isActive={pathname === "/admin/users"}
            />
            <NavItem
              href="/admin/posts"
              icon={FileText}
              title="Posts"
              isActive={pathname === "/admin/posts"}
            />
            <NavItem
              href="/admin/comments"
              icon={MessageSquare}
              title="Comments"
              isActive={pathname === "/admin/comments"}
            />

            {/* Divider */}
            <li className="my-4 border-t border-gray-200 dark:border-gray-700" />

            <NavItem
              href="/admin/settings"
              icon={Settings}
              title="Settings"
              isActive={pathname === "/admin/settings"}
            />
          </ul>
        </nav>

        {/* User Info */}
        {/* <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
            <div>
              <p className="font-medium">Admin User</p>
              <p className="text-sm text-muted-foreground">admin@example.com</p>
            </div>
          </div>
        </div> */}
      </aside>

      {/* Backdrop overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-30"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}

function NavItem({ href, icon: Icon, title, isActive }: NavItemProps) {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2 transition-colors",
          isActive
            ? "bg-gray-100 dark:bg-gray-700 text-primary"
            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
        )}
      >
        <Icon size={20} />
        <span>{title}</span>
      </Link>
    </li>
  );
}

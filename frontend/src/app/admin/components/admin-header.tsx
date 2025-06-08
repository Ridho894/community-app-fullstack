"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  Search,
  Moon,
  Sun,
  User,
  LogOut,
  Settings,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";

export default function AdminHeader() {
  const pathname = usePathname();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const { logout } = useAuth();
  // Extract page title from pathname
  const getPageTitle = () => {
    const path = pathname.split("/").filter(Boolean);
    if (path.length === 1 && path[0] === "admin") {
      return "Dashboard";
    } else if (path.length > 1) {
      return path[1].charAt(0).toUpperCase() + path[1].slice(1);
    }
    return "Dashboard";
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, you would toggle a dark mode class on <html> or use a context
  };

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  return (
    <header className="h-16 px-4 md:px-6 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex items-center justify-between">
      {/* Page Title (Mobile Only) */}
      <h1 className="text-lg font-semibold md:hidden">{getPageTitle()}</h1>

      {/* Search Bar (Hidden on Mobile) */}
      <div className="hidden md:flex relative w-96">
        <Search
          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          size={18}
        />
        <input
          type="text"
          placeholder="Search..."
          className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {/* Notification Button */}
        <button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 relative">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>

        {/* Dark Mode Toggle */}
        <button
          className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
          onClick={toggleDarkMode}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            className="flex items-center space-x-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700"
            onClick={toggleUserMenu}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-700" />
            <span className="hidden md:inline font-medium">Admin User</span>
            <ChevronDown size={16} />
          </button>

          {/* User Menu Dropdown */}
          {showUserMenu && (
            <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-md shadow-lg border border-gray-200 dark:border-gray-700 z-50">
              <a
                href="/admin/profile"
                className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <User size={16} />
                <span>Profile</span>
              </a>
              <a
                href="/admin/settings"
                className="flex items-center space-x-2 px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Settings size={16} />
                <span>Settings</span>
              </a>
              <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
              <button
                onClick={logout}
                className="flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Heart,
  MessageSquare,
  UserPlus,
  ArrowRight,
  Loader,
} from "lucide-react";
import { Button } from "../button";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
  useUnreadNotificationsCount,
} from "@/lib/hooks/use-notifications";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Notification } from "@/types/api";

// Get icon based on notification type
export const getNotificationIcon = (type: string) => {
  switch (type) {
    case "like":
      return <Heart className="h-4 w-4 text-red-500" />;
    case "comment":
      return <MessageSquare className="h-4 w-4 text-blue-500" />;
    case "follow":
      return <UserPlus className="h-4 w-4 text-green-500" />;
    case "post_approved":
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    case "post_rejected":
      return <XCircle className="h-4 w-4 text-red-500" />;
    default:
      return <Bell className="h-4 w-4 text-gray-500" />;
  }
};

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications, isLoading } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsAsRead();
  const { data: unreadCountData } = useUnreadNotificationsCount();
  const router = useRouter();

  const unreadCount = unreadCountData?.count || 0;

  // Only show the most recent 4 notifications in the dropdown
  const recentNotifications = notifications
    ? notifications.data.slice(0, 4)
    : [];

  const toggleOpen = () => setOpen(!open);

  // Handle notification click based on type
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // For post-related notifications, navigate to the post
    if (notification.entityType === "post" && notification.entityId) {
      // Close the dropdown
      setOpen(false);
      router.push(`/posts/${notification.entityId}`);
    } else if (notification.entityType === "comment" && notification.entityId) {
      // For comments, navigate to the post that contains the comment
      setOpen(false);
      router.push(`/posts/${notification.entityId}`);
    }
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="icon"
        className="relative"
        onClick={toggleOpen}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            {unreadCount}
          </span>
        )}
      </Button>

      {open && (
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => markAllAsRead()}
                  disabled={isMarkingAllRead}
                >
                  {isMarkingAllRead ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    "Mark all as read"
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="px-4 py-3 text-center">
                <Loader className="h-5 w-5 mx-auto text-gray-400 animate-spin" />
              </div>
            ) : !notifications || notifications.data.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500 dark:text-gray-400">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100 dark:divide-gray-700">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer ${
                      !notification.isRead
                        ? "bg-blue-50 dark:bg-blue-900/20"
                        : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 dark:text-gray-100 font-medium">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(notification.createdAt), {
                          addSuffix: true,
                        })}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          {notifications && notifications.data.length > 0 && (
            <div className="px-4 py-3 border-t dark:border-gray-700">
              <Link
                href="/notifications"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center text-sm text-blue-600 dark:text-blue-400 font-medium"
              >
                See all notifications
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

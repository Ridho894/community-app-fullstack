"use client";

import { useState } from "react";
import {
  Bell,
  CheckCircle,
  XCircle,
  Heart,
  MessageSquare,
  UserPlus,
} from "lucide-react";
import { Button } from "../button";
import { useNotifications } from "@/lib/websocket";
import { Avatar } from "../avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { formatDistanceToNow } from "date-fns";
import { useRouter } from "next/navigation";

// Define notification type
interface Notification {
  id: number;
  type: string;
  senderId: number;
  entityId: number;
  message: string;
  createdAt: string | Date;
  read: boolean;
}

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, markAsRead, markAllAsRead } = useNotifications();
  const router = useRouter();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const toggleOpen = () => setOpen(!open);

  // Handle notification click based on type
  const handleNotificationClick = (notification: Notification) => {
    markAsRead(notification.id);

    // For post-related notifications, navigate to the post
    if (
      ["like", "comment", "post_approved", "post_rejected"].includes(
        notification.type
      )
    ) {
      // Close the dropdown
      setOpen(false);

      // Navigate to the post if it's an approved post or like/comment
      if (notification.type !== "post_rejected") {
        router.push(`/posts/${notification.entityId}`);
      } else {
        // For rejected posts, stay on the current page
        // We could redirect to a different page if needed
      }
    }
  };

  // Get icon based on notification type
  const getNotificationIcon = (type: string) => {
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
        <div className="absolute right-0 mt-2 w-80 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
          <div className="px-4 py-3 border-b">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium">Notifications</h3>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs"
                  onClick={() => markAllAsRead()}
                >
                  Mark all as read
                </Button>
              )}
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-6 text-center text-sm text-gray-500">
                No notifications yet
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 flex items-start gap-3 hover:bg-gray-50 cursor-pointer ${
                      !notification.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900 font-medium">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
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
        </div>
      )}
    </div>
  );
}

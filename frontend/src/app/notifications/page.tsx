"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState } from "react";
import { SocialLayout } from "@/components/layout/social-layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  useNotifications,
  useMarkNotificationAsRead,
  useMarkAllNotificationsAsRead,
} from "@/lib/hooks/use-notifications";
import { Bell, CheckCircle, Loader, MailOpen } from "lucide-react";
import { format } from "date-fns";
import { Notification } from "@/types/api";
import Link from "next/link";
import { getNotificationIcon } from "@/components/ui/notification/notification-bell";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { data: notifications, isLoading, refetch } = useNotifications();
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsAsRead();

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle mark single notification as read
  const handleMarkAsRead = (id: number) => {
    markAsRead(id, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.isRead) {
      markAsRead(notification.id);
    }

    // Navigate based on notification type
    if (notification.entityType === "post" && notification.entityId) {
      router.push(`/posts/${notification.entityId}`);
    } else if (notification.entityType === "comment" && notification.entityId) {
      // For comments, we would typically go to the post that contains the comment
      router.push(`/posts/${notification.entityId}`);
    }
  };

  return (
    <ProtectedRoute>
      <SocialLayout>
        <div className="max-w-[600px] mx-auto pt-4 pb-12">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {notifications && notifications.data.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAllAsRead}
                disabled={isMarkingAllRead}
              >
                {isMarkingAllRead ? (
                  <Loader className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <CheckCircle className="mr-2 h-4 w-4" />
                )}
                Mark all as read
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : !notifications || notifications.data.length === 0 ? (
            <Card className="p-8 text-center">
              <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h2 className="text-xl font-semibold mb-2">
                No notifications yet
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-4">
                We'll notify you when you have new activity.
              </p>
              <Button variant="outline" asChild>
                <Link href="/">Back to Home</Link>
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {notifications.data.map((notification) => (
                <Card
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors ${
                    notification.isRead
                      ? "bg-gray-50 dark:bg-gray-800"
                      : "bg-white dark:bg-gray-700 border-blue-500 dark:border-blue-400"
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`rounded-full p-2 ${
                        notification.isRead
                          ? "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                          : "bg-blue-100 dark:bg-blue-900 text-blue-500 dark:text-blue-400"
                      }`}
                    >
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <span className="flex items-center gap-2">
                          <h3 className="font-semibold">
                            {notification.sender.username}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-300">
                            {notification.message}
                          </p>
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {format(
                            new Date(notification.createdAt),
                            "MMM d, h:mm a"
                          )}
                        </span>
                      </div>
                    </div>
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkAsRead(notification.id);
                        }}
                      >
                        <MailOpen className="h-4 w-4" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </SocialLayout>
    </ProtectedRoute>
  );
}

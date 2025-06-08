"use client";

import { useAuth } from "@/contexts/auth-context";
import { useState, useEffect } from "react";
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
import InfiniteScroll from "react-infinite-scroll-component";
import { notificationApi } from "@/lib/api/notifications";

export default function NotificationsPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [allNotifications, setAllNotifications] = useState<Notification[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const {
    data: notificationsData,
    isLoading,
    refetch,
  } = useNotifications(1, 10); // Always fetch first page
  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { mutate: markAllAsRead, isPending: isMarkingAllRead } =
    useMarkAllNotificationsAsRead();

  // Initialize notifications data from first page
  useEffect(() => {
    if (notificationsData && !isLoading && initialLoading) {
      setAllNotifications(notificationsData.data);
      setHasMore(notificationsData.meta.totalPages > 1);
      setInitialLoading(false);
      // If there's more than one page, set page to 1 to start with
      if (notificationsData.meta.totalPages > 1) {
        setPage(1);
      }
    }
  }, [notificationsData, isLoading, initialLoading]);

  // Handle loading more notifications
  const fetchMoreNotifications = async () => {
    // Don't fetch if we're already loading
    if (isLoadingMore) return;

    try {
      setIsLoadingMore(true);
      const nextPage = page + 1;

      const result = await notificationApi.getNotifications(nextPage, 10);

      if (result.data.length === 0) {
        setHasMore(false);
        setIsLoadingMore(false);
        return;
      }

      // Combine existing notifications with new ones
      setAllNotifications((prevNotifications) => {
        // Create a Set of existing IDs to avoid duplicates
        const existingIds = new Set(prevNotifications.map((n) => n.id));

        // Filter out any duplicates from the new data
        const uniqueNewNotifications = result.data.filter(
          (n) => !existingIds.has(n.id)
        );

        const combined = [...prevNotifications, ...uniqueNewNotifications];

        return combined;
      });

      setPage(nextPage);
      setHasMore(nextPage < result.meta.totalPages);
      setIsLoadingMore(false);
    } catch (error) {
      console.error("Failed to fetch more notifications:", error);
      setHasMore(false);
      setIsLoadingMore(false);
    }
  };

  // Handle mark all as read
  const handleMarkAllAsRead = () => {
    markAllAsRead(undefined, {
      onSuccess: () => {
        // Update local state to mark all as read
        setAllNotifications((prevNotifications) =>
          prevNotifications.map((notification) => ({
            ...notification,
            read: true,
          }))
        );
        refetch();
      },
    });
  };

  // Handle mark single notification as read
  const handleMarkAsRead = (id: number) => {
    markAsRead(id, {
      onSuccess: () => {
        // Update local state to reflect the change
        setAllNotifications((prevNotifications) =>
          prevNotifications.map((notification) =>
            notification.id === id
              ? { ...notification, read: true }
              : notification
          )
        );
      },
    });
  };

  // Handle notification click
  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    if (!notification.read) {
      markAsRead(notification.id);

      // Update local state to reflect the change
      setAllNotifications((prevNotifications) =>
        prevNotifications.map((n) =>
          n.id === notification.id ? { ...n, read: true } : n
        )
      );
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
        <div className="max-w-[600px] mx-auto pt-4 pb-24">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold">Notifications</h1>
            {allNotifications.length > 0 && (
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

          {initialLoading ? (
            <div className="flex justify-center py-12">
              <Loader className="w-8 h-8 animate-spin text-gray-400" />
            </div>
          ) : allNotifications.length === 0 ? (
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
            <InfiniteScroll
              dataLength={allNotifications.length}
              next={fetchMoreNotifications}
              hasMore={hasMore}
              loader={
                <div className="text-center py-4">
                  <Loader className="w-6 h-6 animate-spin text-gray-400 mx-auto" />
                </div>
              }
              endMessage={
                <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                  You've seen all notifications
                </div>
              }
              scrollThreshold={0.9}
            >
              <div className="space-y-4">
                {allNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-4 cursor-pointer transition-colors ${
                      notification.read
                        ? "bg-gray-50 dark:bg-gray-800"
                        : "bg-white dark:bg-gray-700 border-blue-500 dark:border-blue-400"
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-4">
                      {getNotificationIcon(notification.type)}
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
                      {!notification.read && (
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
            </InfiniteScroll>
          )}
        </div>
      </SocialLayout>
    </ProtectedRoute>
  );
}

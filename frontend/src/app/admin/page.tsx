"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAdminStats } from "@/lib/hooks/use-admin";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const { data: stats, isLoading: isLoadingStats } = useAdminStats();

  // Redirect non-admin users to home page
  useEffect(() => {
    if (isAuthenticated && !isAdmin) {
      router.push("/");
    } else if (!isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isAuthenticated, isAdmin, router]);

  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <div className="flex gap-4">
          <Link href="/admin/users">
            <Button variant="outline">Manage Users</Button>
          </Link>
          <Link href="/admin/posts">
            <Button variant="outline">Manage Posts</Button>
          </Link>
          <Link href="/admin/comments">
            <Button variant="outline">Manage Comments</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Users
            </p>
            <h2 className="text-3xl font-bold">
              {isLoadingStats ? "..." : stats?.users.total || 0}
            </h2>
          </div>
        </Card>

        {/* Total Posts Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Posts
            </p>
            <h2 className="text-3xl font-bold">
              {isLoadingStats ? "..." : stats?.posts.total || 0}
            </h2>
          </div>
        </Card>

        {/* Total Comments Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Comments
            </p>
            <h2 className="text-3xl font-bold">
              {isLoadingStats ? "..." : stats?.comments.total || 0}
            </h2>
          </div>
        </Card>

        {/* Pending Posts Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Pending Posts
            </p>
            <h2 className="text-3xl font-bold">
              {isLoadingStats ? "..." : stats?.posts.pending || 0}
            </h2>
          </div>
        </Card>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <Card className="p-6">
          <div className="space-y-8">
            <ActivityItem
              title="New User Registration"
              description="John Doe registered a new account"
              timestamp="2 minutes ago"
            />
            <ActivityItem
              title="New Post Created"
              description="Jane Smith published a new post: 'Getting Started with Next.js'"
              timestamp="15 minutes ago"
            />
            <ActivityItem
              title="Comment Added"
              description="Alex Johnson commented on 'React Server Components'"
              timestamp="45 minutes ago"
            />
            <ActivityItem
              title="Post Updated"
              description="Mike Wilson updated 'TypeScript Best Practices'"
              timestamp="1 hour ago"
            />
          </div>
        </Card>
      </div>
    </div>
  );
}

interface ActivityItemProps {
  title: string;
  description: string;
  timestamp: string;
}

function ActivityItem({ title, description, timestamp }: ActivityItemProps) {
  return (
    <div className="flex justify-between items-start border-b border-gray-100 dark:border-gray-800 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="font-medium">{title}</p>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <span className="text-xs text-muted-foreground">{timestamp}</span>
    </div>
  );
}

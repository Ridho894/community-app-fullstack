"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const router = useRouter();

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
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Users Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Users
            </p>
            <h2 className="text-3xl font-bold">2,543</h2>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+12.5%</span> from last month
            </p>
          </div>
        </Card>

        {/* Total Posts Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Posts
            </p>
            <h2 className="text-3xl font-bold">8,647</h2>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+8.2%</span> from last month
            </p>
          </div>
        </Card>

        {/* Total Comments Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Comments
            </p>
            <h2 className="text-3xl font-bold">12,354</h2>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-500">+5.7%</span> from last month
            </p>
          </div>
        </Card>

        {/* Active Users Card */}
        <Card className="p-6">
          <div className="flex flex-col space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Active Users
            </p>
            <h2 className="text-3xl font-bold">1,876</h2>
            <p className="text-xs text-muted-foreground">
              <span className="text-red-500">-2.3%</span> from last month
            </p>
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

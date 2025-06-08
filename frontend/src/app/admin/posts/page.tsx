"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  useAdminPendingPosts,
  useUpdatePostStatus,
} from "@/lib/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { Post, PostStatus } from "@/types/api";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function AdminPostsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: postsData, isLoading } = useAdminPendingPosts(page, 10);
  const { mutate: updateStatus } = useUpdatePostStatus();

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

  // Type assertion for API response data
  const pendingPosts = ((postsData || {}) as { data: Post[] }).data || [];
  const totalPages =
    ((postsData || {}) as { meta?: { totalPages: number } }).meta?.totalPages ||
    1;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Post Management</h1>
      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading posts...</div>
        ) : !pendingPosts || pendingPosts.length === 0 ? (
          <div className="text-center py-8">No pending posts to review.</div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Pending Posts</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pendingPosts.map((post: Post) => (
                  <TableRow key={post.id}>
                    <TableCell className="font-medium">{post.title}</TableCell>
                    <TableCell>{post.user?.username || "Unknown"}</TableCell>
                    <TableCell>
                      {format(new Date(post.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell className="flex gap-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() =>
                          updateStatus({
                            postId: post.id,
                            status: PostStatus.APPROVED,
                          })
                        }
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() =>
                          updateStatus({
                            postId: post.id,
                            status: PostStatus.REJECTED,
                          })
                        }
                      >
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-end space-x-2 mt-4">
              <Button
                variant="outline"
                size="sm"
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

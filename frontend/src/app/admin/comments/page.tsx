"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAdminComments, useDeleteComment } from "@/lib/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Comment } from "@/types/api";

export default function AdminCommentsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const { data: commentsData, isLoading } = useAdminComments(page, 10);
  const { mutate: deleteComment } = useDeleteComment();

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
  const comments = ((commentsData || {}) as { data: Comment[] }).data || [];
  const totalPages =
    ((commentsData || {}) as { meta?: { totalPages: number } }).meta
      ?.totalPages || 1;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Comment Management</h1>

      <Card className="p-6">
        {isLoading ? (
          <div className="text-center py-8">Loading comments...</div>
        ) : !comments || comments.length === 0 ? (
          <div className="text-center py-8">No comments found.</div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Comments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comments.map((comment: Comment) => (
                  <TableRow key={comment.id}>
                    <TableCell className="max-w-xs truncate">
                      {comment.content}
                    </TableCell>
                    <TableCell>{comment.user?.username || "Unknown"}</TableCell>
                    <TableCell>Post #{comment.postId}</TableCell>
                    <TableCell>
                      {format(new Date(comment.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteComment(comment.id)}
                      >
                        Delete
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

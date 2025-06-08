"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  useAdminPendingPosts,
  useAdminRejectedPosts,
  useUpdatePostStatus,
  useDeletePost,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TabType = "pending" | "rejected";

export default function AdminPostsPage() {
  const { isAuthenticated, isAdmin } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [page, setPage] = useState(1);

  // Load different data based on active tab
  const { data: pendingPostsData, isLoading: pendingLoading } =
    useAdminPendingPosts(activeTab === "pending" ? page : 1, 10);
  const { data: rejectedPostsData, isLoading: rejectedLoading } =
    useAdminRejectedPosts(activeTab === "rejected" ? page : 1, 10);

  const { mutate: updateStatus } = useUpdatePostStatus();
  const { mutate: deletePost } = useDeletePost();

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

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

  // Get current data based on active tab
  const isLoading = activeTab === "pending" ? pendingLoading : rejectedLoading;
  const postsData =
    activeTab === "pending" ? pendingPostsData : rejectedPostsData;

  // Type assertion for API response data
  const posts = ((postsData || {}) as { data: Post[] }).data || [];
  const totalPages =
    ((postsData || {}) as { meta?: { totalPages: number } }).meta?.totalPages ||
    1;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Post Management</h1>
      <Card className="p-6">
        <Tabs
          defaultValue="pending"
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="pending">Pending Posts</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="pending">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-8">
                No pending posts to review.
              </div>
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
                    {posts.map((post: Post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          {post.user?.username || "Unknown"}
                        </TableCell>
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
              </div>
            )}
          </TabsContent>

          <TabsContent value="rejected">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-8">No rejected posts found.</div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">Rejected Posts</h3>
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
                    {posts.map((post: Post) => (
                      <TableRow key={post.id}>
                        <TableCell className="font-medium">
                          {post.title}
                        </TableCell>
                        <TableCell>
                          {post.user?.username || "Unknown"}
                        </TableCell>
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
                            onClick={() => deletePost(post.id)}
                          >
                            Delete
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>

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
      </Card>
    </div>
  );
}

"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import {
  useAdminPendingPosts,
  useAdminRejectedPosts,
  useAdminAllPosts,
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
import { Loader } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";

type TabType = "all" | "pending" | "rejected";

export default function AdminPostsPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabType>("pending");
  const [page, setPage] = useState(1);

  // Load different data based on active tab
  const { data: pendingPostsData, isLoading: pendingLoading } =
    useAdminPendingPosts(activeTab === "pending" ? page : 1, 10);
  const { data: rejectedPostsData, isLoading: rejectedLoading } =
    useAdminRejectedPosts(activeTab === "rejected" ? page : 1, 10);
  const { data: allPostsData, isLoading: allLoading } = useAdminAllPosts(
    activeTab === "all" ? page : 1,
    10
  );

  const { mutate: updateStatus, isPending: isUpdating } = useUpdatePostStatus();
  const { mutate: deletePost, isPending: isDeleting } = useDeletePost();

  // State for confirmation modals
  const [postToApprove, setPostToApprove] = useState<number | null>(null);
  const [postToReject, setPostToReject] = useState<number | null>(null);
  const [postToDelete, setPostToDelete] = useState<number | null>(null);

  // Reset page when tab changes
  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  // Redirect non-admin users to home page
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && !isAdmin) {
        router.push("/");
      } else if (!isAuthenticated) {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Handler for approving a post
  const handleApprovePost = (postId: number) => {
    setPostToApprove(postId);
  };

  // Confirm post approval
  const confirmApprovePost = () => {
    if (postToApprove !== null) {
      updateStatus(
        {
          postId: postToApprove,
          status: PostStatus.APPROVED,
        },
        {
          onSuccess: () => {
            setPostToApprove(null);
          },
          onError: (error) => {
            console.error("Error approving post:", error);
            setPostToApprove(null);
          },
        }
      );
    }
  };

  // Handler for rejecting a post
  const handleRejectPost = (postId: number) => {
    setPostToReject(postId);
  };

  // Confirm post rejection
  const confirmRejectPost = () => {
    if (postToReject !== null) {
      updateStatus(
        {
          postId: postToReject,
          status: PostStatus.REJECTED,
        },
        {
          onSuccess: () => {
            setPostToReject(null);
          },
          onError: (error) => {
            console.error("Error rejecting post:", error);
            setPostToReject(null);
          },
        }
      );
    }
  };

  // Handler for deleting a post
  const handleDeletePost = (postId: number) => {
    setPostToDelete(postId);
  };

  // Confirm post deletion
  const confirmDeletePost = () => {
    if (postToDelete !== null) {
      deletePost(postToDelete, {
        onSuccess: () => {
          setPostToDelete(null);
        },
        onError: (error) => {
          console.error("Error deleting post:", error);
          setPostToDelete(null);
        },
      });
    }
  };

  // Show loading state during authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Only render if authenticated and admin
  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  // Get current data based on active tab
  let isLoading = pendingLoading;
  let postsData = pendingPostsData;

  if (activeTab === "rejected") {
    isLoading = rejectedLoading;
    postsData = rejectedPostsData;
  } else if (activeTab === "all") {
    isLoading = allLoading;
    postsData = allPostsData;
  }

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
          value={activeTab}
          onValueChange={(value) => setActiveTab(value as TabType)}
        >
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Posts</TabsTrigger>
            <TabsTrigger value="pending">Pending Posts</TabsTrigger>
            <TabsTrigger value="rejected">Rejected Posts</TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading ? (
              <div className="text-center py-8">Loading posts...</div>
            ) : !posts || posts.length === 0 ? (
              <div className="text-center py-8">No posts found.</div>
            ) : (
              <div>
                <h3 className="text-lg font-medium mb-4">All Posts</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Author</TableHead>
                      <TableHead>Status</TableHead>
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
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              post.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : post.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {post.status}
                          </span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(post.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            variant="default"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleApprovePost(post.id)}
                          >
                            Approve
                          </Button>
                          {post.status !== "rejected" && (
                            <Button
                              variant="destructive"
                              size="sm"
                              disabled={isUpdating}
                              onClick={() => handleRejectPost(post.id)}
                            >
                              Reject
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => handleDeletePost(post.id)}
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
                            disabled={isUpdating}
                            onClick={() => handleApprovePost(post.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isUpdating}
                            onClick={() => handleRejectPost(post.id)}
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
                            disabled={isUpdating}
                            onClick={() => handleApprovePost(post.id)}
                          >
                            Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={isDeleting}
                            onClick={() => handleDeletePost(post.id)}
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
        {posts.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </div>
            <div className="flex space-x-2">
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

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={postToApprove !== null}
        onClose={() => setPostToApprove(null)}
        onConfirm={confirmApprovePost}
        title="Approve Post"
        description="Are you sure you want to approve this post? It will be visible to all users."
        confirmText="Approve"
        isLoading={isUpdating}
      />

      <ConfirmationModal
        isOpen={postToReject !== null}
        onClose={() => setPostToReject(null)}
        onConfirm={confirmRejectPost}
        title="Reject Post"
        description="Are you sure you want to reject this post? The author will be notified."
        confirmText="Reject"
        confirmVariant="destructive"
        isLoading={isUpdating}
      />

      <ConfirmationModal
        isOpen={postToDelete !== null}
        onClose={() => setPostToDelete(null)}
        onConfirm={confirmDeletePost}
        title="Delete Post"
        description="Are you sure you want to delete this post? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

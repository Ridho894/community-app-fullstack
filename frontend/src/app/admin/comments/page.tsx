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
import { Loader, Search, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function AdminCommentsPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: commentsData, isLoading, refetch } = useAdminComments(page, 10);
  const { mutate: deleteComment, isPending: isDeleting } = useDeleteComment();

  // States for confirmation modals
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);
  const [selectedComments, setSelectedComments] = useState<number[]>([]);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);

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

  // Type assertion for API response data
  const allComments = ((commentsData || {}) as { data: Comment[] }).data || [];
  const totalPages =
    ((commentsData || {}) as { meta?: { totalPages: number } }).meta
      ?.totalPages || 1;

  // Filter comments by search term
  const filteredComments = searchTerm
    ? allComments.filter(
        (comment) =>
          comment.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (comment.user?.username || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : allComments;

  // Handler for single comment deletion
  const handleDeleteComment = (commentId: number) => {
    setCommentToDelete(commentId);
  };

  // Confirm single comment deletion
  const confirmDeleteComment = () => {
    if (commentToDelete !== null) {
      deleteComment(commentToDelete, {
        onSuccess: () => {
          refetch();
          setCommentToDelete(null);
        },
        onError: (error) => {
          console.error("Failed to delete comment:", error);
          setCommentToDelete(null);
        },
      });
    }
  };

  // Handler for bulk deletion
  const handleBulkDelete = () => {
    if (selectedComments.length > 0) {
      setShowBulkDeleteModal(true);
    }
  };

  // Confirm bulk deletion
  const confirmBulkDelete = async () => {
    try {
      // Delete comments one by one
      for (const commentId of selectedComments) {
        await new Promise<void>((resolve, reject) => {
          deleteComment(commentId, {
            onSuccess: () => resolve(),
            onError: (error) => reject(error),
          });
        });
      }

      // After all deletions, refetch and reset selection
      refetch();
      setSelectedComments([]);
      setShowBulkDeleteModal(false);
    } catch (error) {
      console.error("Failed to delete some comments:", error);
      setShowBulkDeleteModal(false);
    }
  };

  // Toggle comment selection
  const toggleCommentSelection = (commentId: number) => {
    setSelectedComments((prev) =>
      prev.includes(commentId)
        ? prev.filter((id) => id !== commentId)
        : [...prev, commentId]
    );
  };

  // Toggle all comments selection
  const toggleAllComments = () => {
    if (selectedComments.length === filteredComments.length) {
      setSelectedComments([]);
    } else {
      setSelectedComments(filteredComments.map((comment) => comment.id));
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">Comment Management</h1>

      <Card className="p-6">
        {/* Search and bulk actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-6 justify-between">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search comments..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {selectedComments.length > 0 && (
            <Button
              variant="destructive"
              className="flex items-center"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete Selected ({selectedComments.length})
            </Button>
          )}
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading comments...</div>
        ) : !filteredComments || filteredComments.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm
              ? "No comments matching your search."
              : "No comments found."}
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-medium mb-4">Comments</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={
                        selectedComments.length === filteredComments.length &&
                        filteredComments.length > 0
                      }
                      onCheckedChange={toggleAllComments}
                    />
                  </TableHead>
                  <TableHead>Content</TableHead>
                  <TableHead>Author</TableHead>
                  <TableHead>Post</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComments.map((comment: Comment) => (
                  <TableRow key={comment.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedComments.includes(comment.id)}
                        onCheckedChange={() =>
                          toggleCommentSelection(comment.id)
                        }
                      />
                    </TableCell>
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
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
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
          </div>
        )}
      </Card>

      {/* Single comment delete confirmation */}
      <ConfirmationModal
        isOpen={commentToDelete !== null}
        onClose={() => setCommentToDelete(null)}
        onConfirm={confirmDeleteComment}
        title="Delete Comment"
        description="Are you sure you want to delete this comment? This action cannot be undone."
        confirmText="Delete"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />

      {/* Bulk delete confirmation */}
      <ConfirmationModal
        isOpen={showBulkDeleteModal}
        onClose={() => setShowBulkDeleteModal(false)}
        onConfirm={confirmBulkDelete}
        title="Delete Selected Comments"
        description={`Are you sure you want to delete ${selectedComments.length} selected comments? This action cannot be undone.`}
        confirmText="Delete All"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

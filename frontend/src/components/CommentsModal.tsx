"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Loader } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  commentKeys,
  useCommentsByPost,
  useCreateComment,
} from "@/lib/hooks/use-comments";
import Image from "next/image";

interface CommentsModalProps {
  post: {
    id: number;
  };
  isOpen: boolean;
  onClose: () => void;
}

export function CommentsModal({ post, isOpen, onClose }: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the mutation hook for creating comments
  const createCommentMutation = useCreateComment();

  const handleAddComment = async () => {
    if (!commentText.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      await createCommentMutation.mutateAsync({
        postId: post.id,
        content: commentText.trim(),
      });

      // Clear the input and notify parent component
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const { data: commentsData, isLoading: isLoadingComments } =
    useCommentsByPost(post.id, {
      queryKey: commentKeys.list(post.id),
      enabled: isOpen, // Don't fetch on mount, we'll do it when the modal opens
    });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        slideUp
        className="p-0 max-w-[600px] mx-auto overflow-hidden flex flex-col h-[80vh] sm:h-[600px] rounded-t-xl"
      >
        <DialogHeader className="px-6 pt-4 pb-2 border-b">
          <DialogTitle className="text-center">Comments</DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto flex-1 p-4">
          {isLoadingComments ? (
            <div className="flex justify-center items-center h-40">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : commentsData?.data && commentsData?.data.length > 0 ? (
            <div className="space-y-4">
              {commentsData?.data.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <Image
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.username}`}
                      alt={comment.user.username}
                      width={32}
                      height={32}
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-semibold text-sm">
                        {comment.user.username}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(comment.createdAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </div>
                    <p className="text-sm mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No comments yet. Be the first to comment!
            </div>
          )}
        </div>

        {/* Comment input area */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <div className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2">
            <input
              type="text"
              placeholder="Add a comment..."
              className="flex-1 bg-transparent border-0 focus:outline-none text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleAddComment();
                }
              }}
              autoFocus={isOpen}
              disabled={isSubmitting}
            />
            <button
              className="text-primary text-sm font-semibold"
              onClick={handleAddComment}
              disabled={!commentText.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <Loader className="h-4 w-4 animate-spin" />
              ) : (
                "Post"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar } from "@/components/ui/avatar";
import { Post, Comment } from "@/types/api";
import { Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface CommentsModalProps {
  post: {
    id: number;
    comments: Comment[];
  };
  isOpen: boolean;
  onClose: () => void;
  isLoading?: boolean;
}

export function CommentsModal({
  post,
  isOpen,
  onClose,
  isLoading = false,
}: CommentsModalProps) {
  const [commentText, setCommentText] = useState("");

  const handleAddComment = () => {
    if (!commentText.trim()) return;
    // Here you would call your API to add a comment
    // For now, we'll just clear the input
    setCommentText("");
  };

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
          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : post.comments && post.comments.length > 0 ? (
            <div className="space-y-4">
              {post.comments.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <img
                      src={`https://api.dicebear.com/7.x/initials/svg?seed=${comment.user.username}`}
                      alt={comment.user.username}
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
            />
            <button
              className="text-primary text-sm font-semibold"
              onClick={handleAddComment}
              disabled={!commentText.trim()}
            >
              Post
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

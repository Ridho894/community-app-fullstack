"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardHeader } from "./card";
import { Avatar, AvatarImage } from "./avatar";
import { Button } from "./button";
import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { Post as PostType, Comment, LikeableType } from "@/types/api";
import { CommentsModal } from "@/components/CommentsModal";
import { commentKeys, useCommentsByPost } from "@/lib/hooks/use-comments";
import { useToggleLike } from "@/lib/hooks/use-likes";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface PostProps {
  post: PostType;
}

export function Post({ post }: PostProps) {
  const { data: session } = useSession();
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  const { mutate: toggleLike, isPending: isLikeLoading } = useToggleLike();

  const handleLike = () => {
    if (!session) {
      toast.error("Please sign in to like posts");
      return;
    }

    toggleLike(
      { type: LikeableType.POST, id: post.id },
      {
        onSuccess: (data) => {
          setLiked(data.liked);
          setLikeCount((prev) => (data.liked ? prev + 1 : prev - 1));
        },
        onError: (error) => {
          toast.error("Failed to like post. Please try again.");
          console.error("Like error:", error);
        },
      }
    );
  };

  // Format the date
  const timeAgo = formatDistanceToNow(new Date(post.createdAt), {
    addSuffix: true,
  });

  // Extract tags from postTags
  const tags = post.postTags?.map((pt) => pt.tag.name) || [];

  // Add a useEffect to check if the post is already liked by the current user
  useEffect(() => {
    if (session && post.likes) {
      // Check if current user ID is in the likes array
      const isLiked = post.likes.some(
        (like) => like.userId === parseInt(session.user.id)
      );
      setLiked(isLiked);
    }
  }, [post.likes, session]);

  return (
    <>
      <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
        {/* Post Header */}
        <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${post.user.username}`}
                alt={post.user.username}
              />
            </Avatar>
            <div>
              <p className="font-medium text-sm">{post.user.username}</p>
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-xs text-gray-500 mr-2">{timeAgo}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>

        {/* Post Image */}
        {post.imageUrl && (
          <div className="relative aspect-square">
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Action Bar */}
        <div className="px-4 py-2 flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={handleLike}
            disabled={isLikeLoading}
          >
            <Heart
              className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`}
            />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={() => setIsCommentsOpen(true)}
          >
            <MessageCircle className="h-6 w-6" />
          </Button>
          <Button variant="ghost" size="icon" className="h-9 w-9">
            <Share2 className="h-6 w-6" />
          </Button>
        </div>

        {/* Post Content */}
        <CardContent className="p-4 pt-0">
          {/* Like Count */}
          <p className="font-medium text-sm mb-2">
            {likeCount.toLocaleString()} likes
          </p>

          {/* Title and Content */}
          <div className="mb-2">
            <h3 className="font-bold text-base">{post.title}</h3>
            <div className="mb-2">
              <span className="font-medium text-sm mr-2">
                {post.user.username}
              </span>
              <span className="text-sm">{post.content}</span>
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {tags.map((tag) => (
                <span key={tag} className="text-blue-500 text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comment Count */}
          <button
            className="text-gray-500 text-sm hover:text-gray-700 cursor-pointer"
            onClick={() => setIsCommentsOpen(true)}
          >
            View all {post.commentCount || 0} comments
          </button>
        </CardContent>
      </Card>

      {/* Comments Modal */}
      <CommentsModal
        post={{
          id: post.id,
        }}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />
    </>
  );
}

"use client";

import { Heart, MessageCircle, Share2, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Button } from "./button";
import { useState } from "react";
import { type Post } from "@/lib/mock-posts";

interface PostProps {
  post: Post;
}

export function Post({ post }: PostProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);

  const handleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1);
    } else {
      setLikeCount(likeCount + 1);
    }
    setLiked(!liked);
  };

  return (
    <Card className="border-gray-200 dark:border-gray-800 shadow-sm">
      {/* Post Header */}
      <CardHeader className="flex flex-row items-center justify-between p-4 space-y-0">
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={post.user.avatar} alt={post.user.username} />
            <AvatarFallback>
              {post.user.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium text-sm">{post.user.username}</p>
          </div>
        </div>
        <div className="flex items-center">
          <span className="text-xs text-gray-500 mr-2">{post.postedAt}</span>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>

      {/* Post Image */}
      <div className="relative aspect-square">
        <img
          src={post.image}
          alt="Post content"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Action Bar */}
      <div className="px-4 py-2 flex items-center space-x-4">
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9"
          onClick={handleLike}
        >
          <Heart
            className={`h-6 w-6 ${liked ? "fill-red-500 text-red-500" : ""}`}
          />
        </Button>
        <Button variant="ghost" size="icon" className="h-9 w-9">
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

        {/* Caption */}
        <div className="mb-2">
          <span className="font-medium text-sm mr-2">{post.user.username}</span>
          <span className="text-sm">{post.caption}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1 mb-2">
          {post.tags.map((tag) => (
            <span key={tag} className="text-blue-500 text-sm">
              #{tag}
            </span>
          ))}
        </div>

        {/* Comment Count */}
        <p className="text-gray-500 text-sm">
          View all {post.comments} comments
        </p>
      </CardContent>

      {/* Add Comment (optional) */}
      <CardFooter className="p-4 pt-0">
        <div className="w-full flex items-center space-x-2">
          <Avatar className="h-7 w-7">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <input
            type="text"
            placeholder="Add a comment..."
            className="flex-1 text-sm bg-transparent focus:outline-none"
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-blue-500 font-medium"
          >
            Post
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

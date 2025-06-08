"use client";

import { useState, useEffect } from "react";
import { SocialLayout } from "@/components/layout/social-layout";
import { Button } from "@/components/ui/button";
import { Grid, Heart, Loader, Edit, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AvatarImage } from "@radix-ui/react-avatar";
import { Avatar } from "@/components/ui/avatar";
import { useMyPosts } from "@/lib/hooks/use-posts";
import { Post as PostType } from "@/types/api";
import { useRouter } from "next/navigation";
import { postApi } from "@/lib/api/posts";
import { toast } from "sonner";
import Image from "next/image";

type TabType = "posts" | "liked";

export default function ProfilePage() {
  const { logout, user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState<TabType>("posts");
  const [postCount, setPostCount] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // Fetch posts based on the active tab
  const {
    data: postsData,
    isLoading,
    error,
    refetch,
  } = useMyPosts({ type: activeTab === "posts" ? "user" : "like" });

  // Refetch when tab changes or authentication status changes
  useEffect(() => {
    if (isAuthenticated) {
      refetch();
    }
  }, [activeTab, isAuthenticated, refetch]);

  // Update post count when data changes
  useEffect(() => {
    if (postsData) {
      setPostCount(postsData.meta.total);
    }
  }, [postsData]);

  // Handle edit post
  const handleEdit = (postId: number) => {
    router.push(`/posts/edit/${postId}`);
  };

  // Handle delete post
  const handleDelete = async (postId: number) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        setIsDeleting(true);
        await postApi.deletePost(postId);
        toast.success("Post deleted successfully");
        refetch(); // Refresh the posts list
      } catch (error) {
        console.error("Failed to delete post:", error);
        toast.error("Failed to delete post");
      } finally {
        setIsDeleting(false);
      }
    }
  };

  return (
    <ProtectedRoute>
      <SocialLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[600px] mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Profile Picture */}
              <Avatar className="h-24 w-24">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
                  alt={user?.username || ""}
                />
              </Avatar>

              {/* Profile Info */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                  <h1 className="text-2xl font-bold">
                    {user?.username || user?.email}
                  </h1>
                  <div className="flex gap-2">
                    <Button onClick={logout} variant="outline" size="sm">
                      Logout
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex justify-center md:justify-start gap-6 mb-4">
                  <div className="text-center md:text-left">
                    <span className="font-bold">{postCount}</span>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Posts
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-center gap-12">
                <button
                  className={`pt-3 flex items-center gap-1 ${
                    activeTab === "posts"
                      ? "border-t-2 border-black dark:border-white -mt-px font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setActiveTab("posts")}
                >
                  <Grid className="w-4 h-4" />
                  <span className="text-sm font-medium">Posts</span>
                </button>
                <button
                  className={`pt-3 flex items-center gap-1 ${
                    activeTab === "liked"
                      ? "border-t-2 border-black dark:border-white -mt-px font-medium"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                  onClick={() => setActiveTab("liked")}
                >
                  <Heart className="w-4 h-4" />
                  <span className="text-sm font-medium">Liked</span>
                </button>
              </div>
            </div>

            {/* Posts */}
            <div className="mt-6 space-y-6">
              {isLoading || isDeleting ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : error ? (
                <div className="text-center py-12 text-red-500">
                  Error loading posts: {error.message}
                </div>
              ) : !postsData ||
                !postsData.data ||
                postsData.data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  {activeTab === "posts"
                    ? "You haven't created any posts yet."
                    : "You haven't liked any posts yet."}
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 mt-4">
                  {postsData.data.map((post: PostType) => (
                    <div
                      key={post.id}
                      className="aspect-square relative group overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-gray-200 flex justify-center items-center">
                        <Image
                          src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                          alt={post.title}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                      </div>

                      {/* Overlay with buttons (only visible on hover) */}
                      {post.status === "approved" && (
                        <div className="absolute inset-0 bg-black/20 bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-center items-center">
                          {activeTab === "posts" && (
                            <div className="flex gap-2">
                              <Button
                                onClick={() => handleEdit(post.id)}
                                variant="secondary"
                                size="lg"
                                className="rounded-full text-white h-24 w-24 p-0 flex items-center justify-center"
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                onClick={() => handleDelete(post.id)}
                                variant="destructive"
                                size="lg"
                                className="rounded-full text-white h-24 w-24 p-0 flex items-center justify-center"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      )}

                      {/* if post still pending, the show loader in front of image */}
                      {post.status === "pending" && (
                        <div className="absolute bg-black/50 inset-0 flex items-center justify-center">
                          <Loader className="w-8 h-8 animate-spin text-gray-400" />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </SocialLayout>
    </ProtectedRoute>
  );
}

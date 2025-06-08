"use client";

import { useState, useEffect } from "react";
import { SocialLayout } from "@/components/layout/social-layout";
import { useSearchPosts } from "@/lib/hooks/use-posts";
import { Post as PostType } from "@/types/api";
import { Loader, Search } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/lib/hooks/use-debounce";

export default function SearchPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [mounted, setMounted] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const router = useRouter();

  // Only enable the query after the component has mounted on the client
  const { data: searchResults, isLoading } = useSearchPosts(
    debouncedSearchTerm,
    1,
    10,
    { enabled: mounted } as any
  );

  // Set mounted state after component mounts on the client
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleViewPost = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  return (
    <SocialLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[600px] mx-auto">
          <div className="relative mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for posts, titles, content..."
                className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
                <Search className="h-5 w-5" />
              </span>
            </div>
          </div>

          {/* Search Results */}
          {mounted && debouncedSearchTerm.trim() !== "" && (
            <div className="mt-6 space-y-4">
              <h2 className="text-lg font-semibold">
                {isLoading
                  ? "Searching..."
                  : `Results for "${debouncedSearchTerm}"`}
              </h2>

              {isLoading ? (
                <div className="flex justify-center py-12">
                  <Loader className="w-8 h-8 animate-spin text-gray-400" />
                </div>
              ) : !searchResults?.data || searchResults.data.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  No posts found matching your search.
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-1 mt-4">
                  {searchResults.data.map((post: PostType) => (
                    <div
                      key={post.id}
                      className="aspect-square relative group overflow-hidden cursor-pointer"
                      onClick={() => handleViewPost(post.id)}
                    >
                      <div className="absolute inset-0 bg-gray-200 flex justify-center items-center">
                        {post.imageUrl && (
                          <Image
                            src={`${process.env.NEXT_PUBLIC_API_URL}${post.imageUrl}`}
                            alt={post.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 33vw"
                          />
                        )}
                      </div>

                      {/* Overlay with post title (visible on hover) */}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                        <p className="text-white font-medium text-sm truncate">
                          {post.title}
                        </p>
                        <p className="text-white/70 text-xs">
                          By {post.user.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Trending Searches (shown when no search is active) */}
          {(!mounted || debouncedSearchTerm.trim() === "") && (
            <div className="mt-8">
              <h2 className="font-medium mb-4">Trending searches</h2>
              <div className="space-y-2">
                {["photography", "travel", "food", "technology", "fashion"].map(
                  (tag) => (
                    <div
                      key={tag}
                      className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
                      onClick={() => setSearchTerm(tag)}
                    >
                      <span>#{tag}</span>
                      <span className="text-sm text-gray-500">
                        {Math.floor(Math.random() * 1000)}k posts
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SocialLayout>
  );
}

"use client";

import { usePosts } from "@/lib/hooks/use-posts";
import { Post } from "./post";
import { Loader } from "lucide-react";
import { PostStatus } from "@/types/api";

export function Feed() {
  const { data, isLoading, isError, error } = usePosts({
    page: 1,
    status: PostStatus.APPROVED,
  });

  return (
    <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
      <div className="max-w-[600px] mx-auto flex flex-col gap-6">
        {isLoading && (
          <div className="flex justify-center items-center">
            <Loader className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
        {isError && <div>Error: {error.message}</div>}
        {!isLoading && !isError && (
          <>
            {data?.data.map((post) => (
              <Post key={post.id} post={post} />
            ))}
          </>
        )}
      </div>
    </div>
  );
}

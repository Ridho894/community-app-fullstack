import { Post } from "./post";
import { mockPosts } from "@/lib/mock-posts";

export function Feed() {
  return (
    <div className="w-full mx-auto px-4 sm:px-6 md:px-8">
      {/* Instagram-style centered feed */}
      <div className="max-w-[600px] mx-auto flex flex-col gap-6">
        {mockPosts.map((post) => (
          <Post key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}

import { SocialLayout } from "@/components/layout/social-layout";

export default function SearchPage() {
  return (
    <SocialLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for people, posts, tags..."
              className="w-full px-4 py-3 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute top-1/2 right-3 transform -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          <div className="mt-8">
            <h2 className="font-medium mb-4">Trending searches</h2>
            <div className="space-y-2">
              {["photography", "travel", "food", "technology", "fashion"].map(
                (tag) => (
                  <div
                    key={tag}
                    className="bg-white dark:bg-gray-800 p-3 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between"
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
        </div>
      </div>
    </SocialLayout>
  );
}

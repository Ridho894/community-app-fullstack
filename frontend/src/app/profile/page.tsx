import { SocialLayout } from "@/components/layout/social-layout";
import { Button } from "@/components/ui/button";
import { Settings, Grid, Bookmark, Heart } from "lucide-react";

export default function ProfilePage() {
  return (
    <SocialLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-[600px] mx-auto">
          {/* Profile Header */}
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
            {/* Profile Picture */}
            <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0" />

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h1 className="text-2xl font-bold">username</h1>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    Edit Profile
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Stats */}
              <div className="flex justify-center md:justify-start gap-6 mb-4">
                <div className="text-center md:text-left">
                  <span className="font-bold">128</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Posts
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold">4.2K</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Followers
                  </p>
                </div>
                <div className="text-center md:text-left">
                  <span className="font-bold">1.5K</span>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Following
                  </p>
                </div>
              </div>

              {/* Bio */}
              <div>
                <p className="font-medium">Display Name</p>
                <p className="text-sm">
                  Bio description goes here. This is a sample bio for the
                  profile page.
                </p>
                <p className="text-sm text-blue-500">website.com</p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-t border-gray-200 dark:border-gray-700">
            <div className="flex justify-center gap-12">
              <button className="border-t-2 border-black dark:border-white -mt-px pt-3 flex items-center gap-1">
                <Grid className="w-4 h-4" />
                <span className="text-sm font-medium">Posts</span>
              </button>
              <button className="text-gray-500 dark:text-gray-400 pt-3 flex items-center gap-1">
                <Bookmark className="w-4 h-4" />
                <span className="text-sm font-medium">Saved</span>
              </button>
              <button className="text-gray-500 dark:text-gray-400 pt-3 flex items-center gap-1">
                <Heart className="w-4 h-4" />
                <span className="text-sm font-medium">Liked</span>
              </button>
            </div>
          </div>

          {/* Grid of Posts */}
          <div className="grid grid-cols-3 gap-1 mt-4">
            {Array.from({ length: 9 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 dark:bg-gray-700"
              />
            ))}
          </div>
        </div>
      </div>
    </SocialLayout>
  );
}

"use client";

import { SocialLayout } from "@/components/layout/social-layout";
import { Button } from "@/components/ui/button";
import { Grid, Heart } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function ProfilePage() {
  const { logout, user } = useAuth();

  return (
    <ProtectedRoute>
      <SocialLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-[600px] mx-auto">
            {/* Profile Header */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6 mb-8">
              {/* Profile Picture */}

              <div className="w-24 h-24 md:w-36 md:h-36 rounded-full bg-gray-200 dark:bg-gray-700 flex-shrink-0 flex items-center justify-center text-2xl font-bold">
                {user?.username?.charAt(0).toUpperCase()}
              </div>

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
                    <span className="font-bold">128</span>
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
                <button className="border-t-2 border-black dark:border-white -mt-px pt-3 flex items-center gap-1">
                  <Grid className="w-4 h-4" />
                  <span className="text-sm font-medium">Posts</span>
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
    </ProtectedRoute>
  );
}

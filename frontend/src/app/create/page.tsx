"use client";

import { ImageIcon, MapPin, AtSign, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLayout } from "@/components/layout/social-layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

export default function CreatePostPage() {
  return (
    <ProtectedRoute>
      <SocialLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

            <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700" />
                <p className="font-medium">username</p>
              </div>

              {/* Text Area */}
              <textarea
                placeholder="What's on your mind?"
                className="w-full border-none bg-transparent focus:outline-none resize-none mb-4 min-h-[120px]"
              ></textarea>

              {/* Upload Preview */}
              <div className="aspect-square bg-gray-100 dark:bg-gray-900 rounded-lg mb-4 border-2 border-dashed border-gray-300 dark:border-gray-600 flex items-center justify-center">
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 p-8"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">Upload Photo</span>
                </Button>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon">
                    <ImageIcon className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MapPin className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <AtSign className="w-5 h-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Smile className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Submit Button */}
              <Button className="w-full">Post</Button>
            </div>
          </div>
        </div>
      </SocialLayout>
    </ProtectedRoute>
  );
}

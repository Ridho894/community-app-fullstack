"use client";

import { useCallback, useState } from "react";
import { ImageIcon, MapPin, AtSign, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SocialLayout } from "@/components/layout/social-layout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Avatar } from "@/components/ui/avatar";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useAuth } from "@/contexts/auth-context";
import { useCreatePost } from "@/lib/hooks/use-posts";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
      setSelectedFile(file);
    }
  };

  const { user } = useAuth();

  const { mutate: createPost } = useCreatePost();

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      setError("Please provide both title and content for your post");
      return;
    }

    if (!selectedFile) {
      setError("Please upload an image for your post");
      return;
    }

    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    try {
      const postData = {
        title: title.trim(),
        content: content.trim(),
      };

      createPost(
        {
          data: postData,
          image: selectedFile,
        },
        {
          onSuccess: (data) => {
            router.push("/");
          },
          onError: (error: any) => {
            console.error("Error creating post:", error);
            if (error.message) {
              setError(
                typeof error.message === "string"
                  ? error.message
                  : JSON.stringify(error.message)
              );
            } else {
              setError("Failed to create post. Please try again.");
            }
            setIsSubmitting(false);
          },
        }
      );
    } catch (error) {
      console.error("Error creating post:", error);
      setError("Failed to create post. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <ProtectedRoute>
      <SocialLayout>
        <div className="max-w-[600px] mx-auto pt-4 pb-12">
          <h1 className="text-2xl font-bold mb-6">Create New Post</h1>

          <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center gap-3 mb-6">
              <Avatar className="h-7 w-7">
                <AvatarImage
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.username}`}
                  alt={user?.username || ""}
                />
              </Avatar>
              <p className="font-medium">{user?.username}</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-md">
                {error}
              </div>
            )}

            {/* Title input */}
            <input
              type="text"
              placeholder="Post title"
              className="w-full bg-transparent border-b border-gray-200 dark:border-gray-700 focus:outline-none mb-4 pb-2 font-medium text-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            {/* Text Area */}
            <textarea
              placeholder="What's on your mind?"
              className="w-full border-none bg-transparent focus:outline-none resize-none mb-4 min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            ></textarea>

            {/* Upload Preview */}
            <div
              className={`aspect-square rounded-lg mb-4 border-2 border-dashed flex items-center justify-center relative cursor-pointer transition-all
                  ${
                    dragActive
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900"
                      : "border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-900"
                  }`}
              onDragOver={(e) => {
                e.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={() => setDragActive(false)}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer"
                onChange={handleChange}
              />
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <Button
                  variant="ghost"
                  className="flex flex-col items-center gap-2 p-8"
                >
                  <ImageIcon className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-500">Upload Photo</span>
                </Button>
              )}
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
            <Button
              className="w-full"
              onClick={handleSubmit}
              disabled={
                isSubmitting ||
                !title.trim() ||
                !content.trim() ||
                !selectedFile
              }
            >
              {isSubmitting ? "Creating..." : "Post"}
            </Button>
          </div>
        </div>
      </SocialLayout>
    </ProtectedRoute>
  );
}

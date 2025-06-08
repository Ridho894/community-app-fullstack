"use client";

import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useAdminUsers, useDeleteUser } from "@/lib/hooks/use-admin";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Loader, Search, Trash } from "lucide-react";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { Input } from "@/components/ui/input";

export default function AdminUsersPage() {
  const { isAuthenticated, isAdmin, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const { data: usersData, isLoading } = useAdminUsers(page, 10);
  const { mutate: deleteUser, isPending: isDeleting } = useDeleteUser();

  // State for confirmation modal
  const [userToDelete, setUserToDelete] = useState<number | null>(null);
  const [deleteUsername, setDeleteUsername] = useState<string>("");

  // Redirect non-admin users to home page
  useEffect(() => {
    if (!authLoading) {
      if (isAuthenticated && !isAdmin) {
        router.push("/");
      } else if (!isAuthenticated) {
        router.push("/auth/login");
      }
    }
  }, [isAuthenticated, isAdmin, authLoading, router]);

  // Show loading state during authentication check
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="mr-2 h-12 w-12 animate-spin" />
      </div>
    );
  }

  // Only render if authenticated and admin
  if (!isAuthenticated || !isAdmin) {
    return null; // Don't render anything while redirecting
  }

  // Handler for deleting a user
  const handleDeleteUser = (userId: number, username: string) => {
    setUserToDelete(userId);
    setDeleteUsername(username);
  };

  // Confirm user deletion
  const confirmDeleteUser = () => {
    if (userToDelete !== null) {
      deleteUser(userToDelete, {
        onSuccess: () => {
          setUserToDelete(null);
          setDeleteUsername("");
        },
        onError: (error) => {
          console.error("Error deleting user:", error);
          setUserToDelete(null);
          setDeleteUsername("");
        },
      });
    }
  };

  // Filter users by search term
  const filteredUsers =
    searchTerm && usersData?.data
      ? usersData.data.filter(
          (user) =>
            user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : usersData?.data || [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold tracking-tight">User Management</h1>

      <Card className="p-6">
        {/* Search box */}
        <div className="mb-6">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search users..."
              className="pl-8"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {isLoading ? (
          <div className="text-center py-8">Loading users...</div>
        ) : !filteredUsers || filteredUsers.length === 0 ? (
          <div className="text-center py-8">
            {searchTerm ? "No users matching your search." : "No users found."}
          </div>
        ) : (
          <div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Username</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.username}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
                            : "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
                        }`}
                      >
                        {user.role}
                      </span>
                    </TableCell>
                    <TableCell>
                      {format(new Date(user.createdAt), "MMM d, yyyy")}
                    </TableCell>
                    <TableCell>
                      {user.role !== "admin" && (
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            handleDeleteUser(Number(user.id), user.username)
                          }
                          disabled={isDeleting}
                        >
                          <Trash className="mr-2 h-4 w-4" />
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-500">
                Page {page} of {usersData?.meta?.totalPages || 1}
              </div>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage(page - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= (usersData?.meta?.totalPages || 1)}
                  onClick={() => setPage(page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Delete User Confirmation Modal */}
      <ConfirmationModal
        isOpen={userToDelete !== null}
        onClose={() => {
          setUserToDelete(null);
          setDeleteUsername("");
        }}
        onConfirm={confirmDeleteUser}
        title="Delete User"
        description={`Are you sure you want to delete the user "${deleteUsername}"? This action cannot be undone and will delete all their posts and comments.`}
        confirmText="Delete User"
        confirmVariant="destructive"
        isLoading={isDeleting}
      />
    </div>
  );
}

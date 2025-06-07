import {
  Search,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { Card } from "../components/ui/card";

interface CommentData {
  id: string;
  author: string;
  content: string;
  postTitle: string;
  status: "approved" | "pending" | "rejected";
  date: string;
}

const mockComments: CommentData[] = [
  {
    id: "1",
    author: "John Doe",
    content: "This is a great article! I learned a lot from it.",
    postTitle: "Getting Started with Next.js 13",
    status: "approved",
    date: "2023-05-15",
  },
  {
    id: "2",
    author: "Jane Smith",
    content:
      "Could you explain more about TypeScript generics in the next article?",
    postTitle: "Mastering TypeScript: Tips and Tricks",
    status: "approved",
    date: "2023-05-16",
  },
  {
    id: "3",
    author: "Bob Johnson",
    content:
      "I found a typo in the third paragraph. It should be 'component' not 'compnent'.",
    postTitle: "Introduction to shadcn/ui Components",
    status: "pending",
    date: "2023-05-17",
  },
  {
    id: "4",
    author: "Alice Williams",
    content:
      "The responsive layout examples really helped me understand how to use Tailwind effectively.",
    postTitle: "Building Responsive Layouts with Tailwind CSS",
    status: "approved",
    date: "2023-05-18",
  },
  {
    id: "5",
    author: "Charlie Brown",
    content:
      "This article contains misleading information. React Context is not always the best solution for state management.",
    postTitle: "State Management with React Context",
    status: "rejected",
    date: "2023-05-19",
  },
];

export default function CommentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Comments</h1>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="Search comments..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Comments List */}
      <Card>
        <div className="p-6 space-y-6 divide-y divide-gray-200 dark:divide-gray-700">
          {mockComments.map((comment) => (
            <div key={comment.id} className="pt-6 first:pt-0">
              <div className="flex justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                    <span className="font-medium text-gray-500 dark:text-gray-400">
                      {comment.author.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{comment.author}</p>
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          comment.status === "approved"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                            : comment.status === "pending"
                            ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                            : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                        }`}
                      >
                        {comment.status.charAt(0).toUpperCase() +
                          comment.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      On:{" "}
                      <a href="#" className="hover:underline">
                        {comment.postTitle}
                      </a>
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {comment.date}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {comment.status === "pending" && (
                    <>
                      <button
                        className="p-1 rounded-full text-green-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Approve"
                      >
                        <CheckCircle size={18} />
                      </button>
                      <button
                        className="p-1 rounded-full text-red-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Reject"
                      >
                        <XCircle size={18} />
                      </button>
                    </>
                  )}
                  <button
                    className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                    title="More options"
                  >
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
              <div className="mt-3 bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                <p className="text-sm">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">5</span> of{" "}
          <span className="font-medium">42</span> comments
        </p>
        <div className="flex items-center space-x-2">
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Previous
          </button>
          <button className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
            1
          </button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            2
          </button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            3
          </button>
          <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

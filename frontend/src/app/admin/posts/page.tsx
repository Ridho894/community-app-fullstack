import {
  FilePlus,
  Search,
  Filter,
  // MoreVertical,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { Card } from "../components/ui/card";

interface PostData {
  id: string;
  title: string;
  author: string;
  category: string;
  status: "published" | "draft" | "archived";
  date: string;
  views: number;
}

const mockPosts: PostData[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 13",
    author: "John Doe",
    category: "Development",
    status: "published",
    date: "2023-04-15",
    views: 1245,
  },
  {
    id: "2",
    title: "Mastering TypeScript: Tips and Tricks",
    author: "Jane Smith",
    category: "Development",
    status: "published",
    date: "2023-05-02",
    views: 982,
  },
  {
    id: "3",
    title: "Introduction to shadcn/ui Components",
    author: "Bob Johnson",
    category: "Design",
    status: "draft",
    date: "2023-05-10",
    views: 0,
  },
  {
    id: "4",
    title: "Building Responsive Layouts with Tailwind CSS",
    author: "Alice Williams",
    category: "Design",
    status: "published",
    date: "2023-05-18",
    views: 675,
  },
  {
    id: "5",
    title: "State Management with React Context",
    author: "Charlie Brown",
    category: "Development",
    status: "archived",
    date: "2023-03-22",
    views: 321,
  },
];

export default function PostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h1 className="text-3xl font-bold tracking-tight">Posts</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors">
          <FilePlus size={18} />
          <span>Add Post</span>
        </button>
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
            placeholder="Search posts..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 dark:border-gray-700 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
          <Filter size={18} />
          <span>Filter</span>
        </button>
      </div>

      {/* Posts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800 text-xs uppercase">
              <tr>
                <th className="px-6 py-3 text-left">Title</th>
                <th className="px-6 py-3 text-left">Author</th>
                <th className="px-6 py-3 text-left">Category</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Views</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockPosts.map((post) => (
                <tr
                  key={post.id}
                  className="bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  <td className="px-6 py-4">
                    <p className="font-medium truncate max-w-[250px]">
                      {post.title}
                    </p>
                  </td>
                  <td className="px-6 py-4">{post.author}</td>
                  <td className="px-6 py-4">{post.category}</td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === "published"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                          : post.status === "draft"
                          ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                      }`}
                    >
                      {post.status.charAt(0).toUpperCase() +
                        post.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4">{post.date}</td>
                  <td className="px-6 py-4">{post.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="View"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Showing <span className="font-medium">1</span> to{" "}
          <span className="font-medium">5</span> of{" "}
          <span className="font-medium">25</span> posts
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

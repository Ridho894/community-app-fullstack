import { TopNavbar } from "@/components/navigation/top-navbar";
import { BottomBar } from "@/components/navigation/bottom-bar";
import { Feed } from "@/components/ui/feed";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      <TopNavbar />
      <main className="flex-1 pb-16 md:pb-0 pt-16">
        <div className="py-8">
          <Feed />
        </div>
      </main>
      <BottomBar />
    </div>
  );
}

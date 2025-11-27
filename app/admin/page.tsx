"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { PendingPostsTab } from "@/components/admin/PendingPostsTab";
import { CoursesTab } from "@/components/admin/CoursesTab";
import { EbooksTab } from "@/components/admin/EbooksTab";

type TabType = 'pending-posts' | 'courses' | 'ebooks';

export default function AdminPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('pending-posts');

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }

    const isAdmin = user.roles?.includes("ROLE_ADMIN");
    if (!isAdmin) {
      router.push("/");
    }
  }, [user, router]);

  if (!user || !user.roles?.includes("ROLE_ADMIN")) {
    return null;
  }

  const renderTab = () => {
    switch (activeTab) {
      case 'pending-posts':
        return <PendingPostsTab />;
      case 'courses':
        return <CoursesTab />;
      case 'ebooks':
        return <EbooksTab />;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-dark-text">Admin Dashboard</h1>

        <div className="flex gap-4 mb-6 border-b border-dark-border">
          <button
            onClick={() => setActiveTab("pending-posts")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "pending-posts"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-dark-muted hover:text-dark-text"
            }`}
          >
            Pending Posts
          </button>
          <button
            onClick={() => setActiveTab("ebooks")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "ebooks"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-dark-muted hover:text-dark-text"
            }`}
          >
            eBooks
          </button>
          <button
            onClick={() => setActiveTab("courses")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "courses"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-dark-muted hover:text-dark-text"
            }`}
          >
            Courses
          </button>
        </div>

        {renderTab()}
      </div>
    </div>
  );
}

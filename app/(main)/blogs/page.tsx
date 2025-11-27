"use client";

import { useState } from "react";
import { SeriesTab } from "@/components/blogs/SeriesTab";
import { PostsTab } from "@/components/blogs/PostsTab";

type TabType = "series" | "posts";

export default function BlogsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("series");

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-dark-text">Blogs</h1>

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-dark-border">
          <button
            onClick={() => setActiveTab("series")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "series"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-dark-muted hover:text-dark-text"
            }`}
          >
            Series
          </button>
          <button
            onClick={() => setActiveTab("posts")}
            className={`px-4 py-2 font-medium transition-colors border-b-2 ${
              activeTab === "posts"
                ? "border-primary-500 text-primary-500"
                : "border-transparent text-dark-muted hover:text-dark-text"
            }`}
          >
            Posts
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === "series" ? <SeriesTab /> : <PostsTab />}
      </div>
    </div>
  );
}
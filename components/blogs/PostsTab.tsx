"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { PostListItem } from "@/lib/types/blog.types";

export function PostsTab() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postService.getPublishedPosts(page, 10);
      setPosts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
        {error}
      </div>
    );
  }

  return (
    <div>
      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          No posts available yet.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/posts/${post.slug}`}
              className="block bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary-500 transition-colors"
            >
              <h2 className="text-xl font-semibold text-dark-text mb-2">
                {post.title}
              </h2>
              <p className="text-dark-muted mb-3">{post.excerpt}</p>
              <div className="flex items-center gap-4 text-sm text-dark-muted">
                <span>By {post.author?.displayName || 'Unknown'}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-8">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 transition-colors"
          >
            Previous
          </button>
          <span className="px-4 py-2 text-dark-text">
            Page {currentPage + 1} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={currentPage === totalPages - 1}
            className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary-500 transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { PostListItem } from "@/lib/types/blog.types";

export function PostsTab() {
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setCurrentPage(0); // Reset to page 0 when search changes
    loadPosts(0);
  }, [searchQuery]);

  useEffect(() => {
    loadPosts(currentPage);
  }, [currentPage]);

  const loadPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postService.getPublishedPosts(
        page, 
        10, 
        searchQuery || undefined
      );
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
      {/* Search Info */}
      {searchQuery && (
        <div className="mb-6 p-4 bg-dark-card border border-dark-border rounded-lg">
          <p className="text-dark-text">
            Search results for: <span className="font-semibold text-primary-500">"{searchQuery}"</span>
          </p>
          <p className="text-sm text-dark-muted mt-1">
            Found {posts.length} post{posts.length !== 1 ? 's' : ''}
          </p>
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          {searchQuery 
            ? `No posts found for "${searchQuery}"`
            : "No posts available yet."}
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

              <div className="flex items-center gap-2 text-xs text-dark-muted">
                <span>Created at: </span>
                {new Date(post.createdAt).toLocaleDateString()}
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
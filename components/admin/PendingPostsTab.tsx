"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { PostListItem } from "@/lib/types/blog.types";

export function PendingPostsTab() {
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadPendingPosts(currentPage);
  }, [currentPage]);

  const loadPendingPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postService.getPendingPosts(page, 10);
      setPosts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (postId: string) => {
    try {
      setActionLoading(postId);
      await postService.approvePost(postId);
      await loadPendingPosts(currentPage);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  const handleReject = async (postId: string) => {
    if (!confirm("Are you sure you want to reject this post?")) return;

    try {
      setActionLoading(postId);
      await postService.rejectPost(postId);
      await loadPendingPosts(currentPage);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setActionLoading(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          No pending posts to review.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-dark-card border border-dark-border rounded-lg p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <Link
                    href={`/blogs/posts/${post.slug}`}
                    className="text-xl font-semibold text-dark-text hover:text-primary-500 transition-colors"
                  >
                    {post.title}
                  </Link>
                  <p className="text-dark-muted mt-2">{post.excerpt}</p>
                  <div className="flex items-center gap-4 mt-3 text-sm text-dark-muted">
                    <span>By {post.authorName || 'Unknown'}</span>
                    <span>•</span>
                    <span>{post.createdAt}</span>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => handleApprove(post.id)}
                    disabled={actionLoading === post.id}
                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded transition-colors disabled:opacity-50"
                  >
                    {actionLoading === post.id ? "..." : "Approve"}
                  </button>
                  <button
                    onClick={() => handleReject(post.id)}
                    disabled={actionLoading === post.id}
                    className="px-4 py-2 text-sm bg-red-500 hover:bg-red-600 text-white rounded transition-colors disabled:opacity-50"
                  >
                    {actionLoading === post.id ? "..." : "Reject"}
                  </button>
                </div>
              </div>
            </div>
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
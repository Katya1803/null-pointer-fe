"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { PostListItem } from "@/lib/types/blog.types";

export function ProfileBlogsTab() {
  const router = useRouter();
  const [posts, setPosts] = useState<PostListItem[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadMyPosts(currentPage);
  }, [currentPage]);

  const loadMyPosts = async (page: number) => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postService.getMyPosts(page, 10);
      setPosts(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;

    try {
      await postService.deletePost(postId);
      loadMyPosts(currentPage);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmitForReview = async (postId: string) => {
    try {
      await postService.submitForReview(postId);
      loadMyPosts(currentPage);
    } catch (err) {
      setError(getErrorMessage(err));
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
      {/* Create Button */}
      <div className="flex justify-end mb-6"> 
        <button
          onClick={() => router.push("/blogs/posts/create")}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
        >
          Create Post
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Posts List */}
      {posts.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          You haven't created any posts yet.
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
                  <div className="flex items-center gap-2 mt-3 text-sm text-dark-muted">
                    <span>{post.createdAt}</span>
                    {post.status && (
                      <span
                        className={`px-2 py-0.5 rounded text-xs font-medium ${
                          post.status === "PUBLISHED"
                            ? "bg-green-500/10 text-green-400 border border-green-500/50"
                            : post.status === "PENDING"
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/50"
                            : "bg-gray-500/10 text-gray-400 border border-gray-500/50"
                        }`}
                      >
                        {post.status}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => router.push(`/blogs/posts/${post.id}/edit`)}
                    className="px-3 py-1 text-sm bg-dark-bg border border-dark-border rounded hover:border-primary-500 transition-colors text-dark-text"
                  >
                    Edit
                  </button>
                  {post.status === "DRAFT" && (
                    <button
                      onClick={() => handleSubmitForReview(post.id)}
                      className="px-3 py-1 text-sm bg-primary-500/10 border border-primary-500/50 rounded hover:bg-primary-500/20 transition-colors text-primary-400"
                    >
                      Submit for Review
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="px-3 py-1 text-sm bg-red-500/10 border border-red-500/50 rounded hover:bg-red-500/20 transition-colors text-red-400"
                  >
                    Delete
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
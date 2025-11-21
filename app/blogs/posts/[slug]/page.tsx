"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { postService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { useAuthStore } from "@/lib/store/auth-store";
import type { PostDetail } from "@/lib/types/blog.types";

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const slug = params.slug as string;

  const [post, setPost] = useState<PostDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await postService.getPostBySlug(slug);
      setPost(response.data.data);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (post) {
      router.push(`/blogs/posts/${post.id}/edit`);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error || "Post not found"}
          </div>
        </div>
      </div>
    );
  }

  const isAuthor = user && user.id === post.author.id;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <Link
          href="/blogs"
          className="inline-flex items-center text-primary-500 hover:text-primary-600 mb-6"
        >
          ← Back to Blogs
        </Link>

        {/* Post Header */}
        <article className="bg-dark-card border border-dark-border rounded-lg p-8">
          <div className="mb-6">
            <h1 className="text-4xl font-bold text-dark-text mb-4">{post.title}</h1>
            
            <div className="flex items-center justify-between text-sm text-dark-muted">
              <div className="flex items-center gap-4">
                <span>{post.author.username}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
                {post.status !== 'PUBLISHED' && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded text-xs">
                      {post.status}
                    </span>
                  </>
                )}
              </div>
              
              {isAuthor && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-1 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors text-sm"
                >
                  Edit
                </button>
              )}
            </div>

            {post.series && (
              <div className="mt-4 text-sm">
                <span className="text-dark-muted">Part of: </span>
                <Link
                  href={`/blogs/series/${post.series.slug}`}
                  className="text-primary-500 hover:text-primary-600"
                >
                  {post.series.title}
                  {post.series.orderInSeries && ` (#${post.series.orderInSeries})`}
                </Link>
              </div>
            )}
          </div>

          {/* Post Content */}
          <div
            className="prose prose-invert max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </article>
      </div>
    </div>
  );
}
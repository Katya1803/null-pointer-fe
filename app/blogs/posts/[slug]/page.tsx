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
    if (slug) {
      loadPost();
    }
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
          <Link
            href="/blogs"
            className="inline-block mt-4 text-primary-500 hover:text-primary-600"
          >
            ← Back to Blogs
          </Link>
        </div>
      </div>
    );
  }

  // Check if current user is the author
  const isAuthor = user && post.author && user.id === post.author.id;

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
                <span>By {post.author?.displayName || 'Unknown'}</span>
                <span>•</span>
                <span>{post.createdAt}</span>
                {post.status && post.status !== 'PUBLISHED' && (
                  <>
                    <span>•</span>
                    <span className="px-2 py-1 bg-yellow-500/10 border border-yellow-500/50 text-yellow-400 rounded text-xs">
                      {post.status}
                    </span>
                  </>
                )}
              </div>
              
              {isAuthor && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg text-sm transition-colors"
                >
                  Edit Post
                </button>
              )}
            </div>
          </div>

          {/* Series Info */}
          {post.series && (
            <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500/20 rounded-lg">
              <p className="text-sm text-dark-muted mb-1">Part of series:</p>
              <Link
                href={`/blogs/series/${post.series.slug}`}
                className="text-primary-500 hover:text-primary-600 font-medium"
              >
                {post.series.title}
                {post.orderInSeries && ` - Part ${post.orderInSeries}`}
              </Link>
            </div>
          )}

          {/* Post Content */}
          <div 
            className="
              prose prose-invert max-w-none

              /* paragraph spacing */
              [&_p]:my-3 
              [&_p:empty]:h-3 [&_p:empty]:block 

              /* heading sizes + spacing */
              [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:mt-8 [&_h1]:mb-4
              [&_h2]:text-2xl [&_h2]:font-semibold [&_h2]:mt-6 [&_h2]:mb-3
              [&_h3]:text-1xl [&_h3]:font-semibold [&_h3]:mt-4 [&_h3]:mb-2

              /* code / blockquote */
              [&_blockquote]:my-4
              [&_pre]:my-4
            "
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-dark-border">
            <div className="flex items-center justify-between">
              <div className="text-sm text-dark-muted">
                Last updated: {post.updatedAt}
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
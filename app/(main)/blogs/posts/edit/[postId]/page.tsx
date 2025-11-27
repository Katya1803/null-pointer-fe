"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { postService, seriesService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import { useToast } from "@/lib/hooks/useToast";
import type { SeriesListItem, PostDetail } from "@/lib/types/blog.types";

export default function EditPostPage() {
  const router = useRouter();
  const params = useParams();
  const postId = params.postId as string;
  const { user } = useAuthStore();
  const toast = useToast();

  const [post, setPost] = useState<PostDetail | null>(null);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [orderInSeries, setOrderInSeries] = useState<number | undefined>();
  const [seriesList, setSeriesList] = useState<SeriesListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadPost();
    loadSeries();
  }, [user, router, postId]);

  const loadPost = async () => {
    try {
      setIsLoading(true);
      const response = await postService.getPostById(postId);
      const postData = response.data.data;
      
      setPost(postData);
      setTitle(postData.title);
      setSlug(postData.slug);
      setContent(postData.content);
      setSeriesId(postData.series?.id || "");
      setOrderInSeries(postData.orderInSeries);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const loadSeries = async () => {
    try {
      const response = await seriesService.getAllSeries();
      setSeriesList(response.data.data);
    } catch (err) {
      console.error("Failed to load series:", err);
    }
  };

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/\s+/g, "-");
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug || slug === generateSlug(post?.title || "")) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }

    if (!content.trim()) {
      toast.error("Content is required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      await postService.updatePost(postId, {
        title,
        slug,
        content,
        seriesId: seriesId || undefined,
        orderInSeries: seriesId ? orderInSeries : undefined,
      });

      toast.success("Post updated successfully!");
      router.push("/blogs?tab=my-posts");
    } catch (err) {
      setError(getErrorMessage(err));
      toast.error("Failed to update post: " + getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
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
          <button
            onClick={() => router.back()}
            className="mt-4 text-primary-500 hover:text-primary-600"
          >
            ← Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg py-8">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Edit Post</h1>
            <p className="text-dark-muted">Update your blog post</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                maxLength={150}
              />
            </div>

            {/* Slug */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Slug *
              </label>
              <input
                type="text"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
                maxLength={200}
              />
              <p className="mt-1 text-sm text-dark-muted">
                URL-friendly version of the title
              </p>
            </div>

            {/* Series Selection */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Series (Optional)
              </label>
              <select
                value={seriesId}
                onChange={(e) => setSeriesId(e.target.value)}
                className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">No Series</option>
                {seriesList.map((series) => (
                  <option key={series.id} value={series.id}>
                    {series.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Order in Series */}
            {seriesId && (
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Order in Series
                </label>
                <input
                  type="number"
                  value={orderInSeries || ""}
                  onChange={(e) =>
                    setOrderInSeries(e.target.value ? parseInt(e.target.value) : undefined)
                  }
                  className="w-full px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text focus:outline-none focus:ring-2 focus:ring-primary-500"
                  min={1}
                />
              </div>
            )}

            {/* Content Editor */}
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Content *
              </label>
              <TiptapEditor content={content} onChange={setContent} />
            </div>

            {/* Post Status */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-dark-muted">Status:</span>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  post.status === 'PUBLISHED' ? 'bg-green-500/20 text-green-500' :
                  post.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-500' :
                  'bg-gray-500/20 text-gray-500'
                }`}>
                  {post.status}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isSubmitting || !title || !slug || !content}
                className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Updating..." : "Update Post"}
              </button>
              <button
                type="button"
                onClick={() => router.back()}
                className="px-6 py-2 bg-dark-card border border-dark-border text-dark-text hover:border-primary-500 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
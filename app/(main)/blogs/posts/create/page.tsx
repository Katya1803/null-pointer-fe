"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { postService, seriesService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import type { SeriesListItem } from "@/lib/types/blog.types";

export default function CreatePostPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [content, setContent] = useState("");
  const [seriesId, setSeriesId] = useState("");
  const [orderInSeries, setOrderInSeries] = useState<number | undefined>();
  const [seriesList, setSeriesList] = useState<SeriesListItem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    loadSeries();
  }, [user, router]);

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
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setIsSubmitting(true);
      setError("");

      await postService.createPost({
        title,
        slug,
        content,
        seriesId: seriesId || undefined,
        orderInSeries: orderInSeries || undefined,
      });

      router.push("/profile?tab=blogs");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-dark-text">Create New Post</h1>

        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error}
          </div>
        )}

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
              maxLength={200}
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

          {/* Actions */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting || !title || !slug || !content}
              className="px-6 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Creating..." : "Create Post"}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 bg-dark-card border border-dark-border text-dark-text rounded-lg hover:border-primary-500 transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
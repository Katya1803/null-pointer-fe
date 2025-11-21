"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { seriesService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { useAuthStore } from "@/lib/store/auth-store";
import type { SeriesDetail } from "@/lib/types/blog.types";

export default function SeriesDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const slug = params.slug as string;

  const [series, setSeries] = useState<SeriesDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadSeries();
  }, [slug]);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      setError("");
      // Since we only have slug, we need to get all series and find by slug
      const response = await seriesService.getAllSeries();
      const found = response.data.data.find((s) => s.slug === slug);
      
      if (found) {
        const detailResponse = await seriesService.getSeriesById(found.id);
        setSeries(detailResponse.data.data);
      } else {
        setError("Series not found");
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  if (error || !series) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
            {error || "Series not found"}
          </div>
        </div>
      </div>
    );
  }

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

        {/* Series Header */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8 mb-8">
          {series.thumbnail && (
            <img
              src={series.thumbnail}
              alt={series.title}
              className="w-full h-64 object-cover rounded-lg mb-6"
            />
          )}
          
          <h1 className="text-4xl font-bold text-dark-text mb-4">{series.title}</h1>
          
          {series.description && (
            <p className="text-dark-muted text-lg">{series.description}</p>
          )}
        </div>

        {/* Posts List */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <h2 className="text-2xl font-bold text-dark-text mb-6">
            Posts in this Series
          </h2>

          {series.posts.length === 0 ? (
            <p className="text-dark-muted">No posts in this series yet.</p>
          ) : (
            <div className="space-y-4">
              {series.posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/blogs/posts/${post.slug}`}
                  className="block p-4 border border-dark-border rounded-lg hover:border-primary-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {post.order && (
                      <div className="flex-shrink-0 w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center font-bold">
                        {post.order}
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-dark-text">
                        {post.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
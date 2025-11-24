"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { seriesService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { SeriesListItem } from "@/lib/types/blog.types";

export function SeriesTab() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [seriesList, setSeriesList] = useState<SeriesListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user has ROLE_ADMIN
  const isAdmin = user && user.roles && user.roles.includes("ROLE_ADMIN");

  useEffect(() => {
    loadSeries();
  }, []);

  const loadSeries = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await seriesService.getAllSeries();
      setSeriesList(response.data.data);
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
      {/* Create Button - Only for Admins */}
      {isAdmin && (
        <div className="flex justify-end mb-6">
          <button
            onClick={() => router.push("/blogs/series/create")}
            className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
          >
            Create Series
          </button>
        </div>
      )}

      {/* Series List */}
      {seriesList.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          No series available yet.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {seriesList.map((series) => (
            <Link
              key={series.id}
              href={`/blogs/series/${series.slug}`}
              className="bg-dark-card border border-dark-border rounded-lg p-6 hover:border-primary-500 transition-colors"
            >
              <h3 className="text-lg font-semibold text-dark-text mb-2">
                {series.title}
              </h3>
              <p className="text-sm text-dark-muted">{series.slug}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
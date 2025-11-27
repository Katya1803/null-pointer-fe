"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ebookService } from "@/lib/services/ebook.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { EbookListItem } from "@/lib/types/ebook.types";

export default function EbooksPage() {
  const [ebooks, setEbooks] = useState<EbookListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const loadEbooks = useCallback(async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await ebookService.getEbooks(page, 12, keyword || undefined);
      setEbooks(response.data.data.content);
      setTotalPages(response.data.data.totalPages);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  }, [page, keyword]);

  useEffect(() => {
    loadEbooks();
  }, [loadEbooks]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setKeyword(searchInput.trim());
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setKeyword("");
    setPage(0);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-dark-text mb-2">eBooks</h1>
          <p className="text-dark-muted">
            Free programming eBooks for developers
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search by title or author..."
                className="w-full px-4 py-3 pl-11 bg-dark-card border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-muted"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
            >
              Search
            </button>
            {keyword && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-4 py-3 border border-dark-border text-dark-text rounded-lg hover:bg-dark-card transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>

        {/* Search result info */}
        {keyword && (
          <div className="mb-6 text-dark-muted">
            Showing results for "<span className="text-primary-500">{keyword}</span>"
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400 mb-6">
            {error}
          </div>
        )}

        {/* Loading */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : ebooks.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="w-16 h-16 mx-auto text-dark-muted mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
              />
            </svg>
            <p className="text-dark-muted">
              {keyword ? "No ebooks found matching your search." : "No ebooks available yet."}
            </p>
          </div>
        ) : (
          <>
            {/* Ebooks Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {ebooks.map((ebook) => (
                <Link
                  key={ebook.id}
                  href={`/ebooks/${ebook.id}`}
                  className="group"
                >
                  <div className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-primary-500/50 transition-all hover:shadow-lg hover:shadow-primary-500/10">
                    {/* Cover */}
                    <div className="aspect-[3/4] bg-dark-bg overflow-hidden">
                      {ebook.coverUrl ? (
                        <img
                          src={ebook.coverUrl}
                          alt={ebook.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-dark-muted">
                          <svg
                            className="w-12 h-12"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={1.5}
                              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                            />
                          </svg>
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <h3 className="font-medium text-dark-text text-sm line-clamp-2 group-hover:text-primary-500 transition-colors">
                        {ebook.title}
                      </h3>
                      <p className="text-xs text-dark-muted mt-1 truncate">
                        {ebook.author}
                      </p>
                      {ebook.publishedYear && (
                        <p className="text-xs text-dark-muted mt-0.5">
                          {ebook.publishedYear}
                        </p>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="px-4 py-2 border border-dark-border rounded-lg text-dark-text hover:bg-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-dark-muted">
                  Page {page + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={page >= totalPages - 1}
                  className="px-4 py-2 border border-dark-border rounded-lg text-dark-text hover:bg-dark-card transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
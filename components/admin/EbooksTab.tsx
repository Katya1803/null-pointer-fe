"use client";

import { useState, useEffect } from "react";
import { ebookService } from "@/lib/services/ebook.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { EbookListItem, EbookCreateRequest } from "@/lib/types/ebook.types";

export function EbooksTab() {
  const [ebooks, setEbooks] = useState<EbookListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [showForm, setShowForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<EbookCreateRequest>({
    title: "",
    author: "",
    publishedYear: undefined,
    description: "",
    coverUrl: "",
    downloadUrl: "",
  });

  useEffect(() => {
    loadEbooks();
  }, []);

  const loadEbooks = async () => {
    try {
      setIsLoading(true);
      setError("");
      const response = await ebookService.getEbooks(0, 100);
      setEbooks(response.data.data.content);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      author: "",
      publishedYear: undefined,
      description: "",
      coverUrl: "",
      downloadUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = async (ebook: EbookListItem) => {
    try {
      const response = await ebookService.getEbookById(ebook.id);
      const detail = response.data.data;
      setFormData({
        title: detail.title,
        author: detail.author,
        publishedYear: detail.publishedYear,
        description: detail.description || "",
        coverUrl: detail.coverUrl || "",
        downloadUrl: detail.downloadUrl,
      });
      setEditingId(ebook.id);
      setShowForm(true);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.author.trim() || !formData.downloadUrl.trim()) {
      setError("Title, Author and Download URL are required");
      return;
    }

    try {
      setIsSubmitting(true);
      setError("");

      if (editingId) {
        await ebookService.updateEbook(editingId, formData);
      } else {
        await ebookService.createEbook(formData);
      }

      resetForm();
      loadEbooks();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (ebookId: string) => {
    if (!confirm("Are you sure you want to delete this ebook?")) return;

    try {
      await ebookService.deleteEbook(ebookId);
      loadEbooks();
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-dark-text">
          Manage eBooks ({ebooks.length})
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
        >
          {showForm ? "Cancel" : "Add eBook"}
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 text-red-400">
          {error}
        </div>
      )}

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-dark-card border border-dark-border rounded-lg p-6 space-y-4">
          <h3 className="text-lg font-medium text-dark-text mb-4">
            {editingId ? "Edit eBook" : "Add New eBook"}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                placeholder="Enter book title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Author <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                placeholder="Enter author name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Published Year
              </label>
              <input
                type="number"
                value={formData.publishedYear || ""}
                onChange={(e) => setFormData({ ...formData, publishedYear: e.target.value ? parseInt(e.target.value) : undefined })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                placeholder="e.g. 2024"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-text mb-1">
                Cover URL
              </label>
              <input
                type="url"
                value={formData.coverUrl}
                onChange={(e) => setFormData({ ...formData, coverUrl: e.target.value })}
                className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                placeholder="https://res.cloudinary.com/..."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">
              Download URL <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              value={formData.downloadUrl}
              onChange={(e) => setFormData({ ...formData, downloadUrl: e.target.value })}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="https://res.cloudinary.com/.../book.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500 resize-none"
              placeholder="Brief description of the book..."
            />
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : editingId ? "Update" : "Create"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-4 py-2 border border-dark-border text-dark-text rounded-lg hover:bg-dark-bg transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Ebooks List */}
      {ebooks.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          No ebooks yet. Add your first ebook!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ebooks.map((ebook) => (
            <div
              key={ebook.id}
              className="bg-dark-card border border-dark-border rounded-lg p-4 hover:border-primary-500/50 transition-colors"
            >
              <div className="flex gap-4">
                {/* Cover */}
                <div className="flex-shrink-0 w-16 h-20 bg-dark-bg rounded overflow-hidden">
                  {ebook.coverUrl ? (
                    <img
                      src={ebook.coverUrl}
                      alt={ebook.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-dark-muted">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-dark-text truncate">{ebook.title}</h3>
                  <p className="text-sm text-dark-muted truncate">{ebook.author}</p>
                  {ebook.publishedYear && (
                    <p className="text-xs text-dark-muted mt-1">{ebook.publishedYear}</p>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                <button
                  onClick={() => handleEdit(ebook)}
                  className="flex-1 px-3 py-1.5 text-sm border border-dark-border text-dark-text rounded hover:bg-dark-bg transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(ebook.id)}
                  className="flex-1 px-3 py-1.5 text-sm border border-red-500/50 text-red-400 rounded hover:bg-red-500/10 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
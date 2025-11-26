"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { courseService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";

const createCourseSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200, "Slug must not exceed 200 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase letters, numbers, and hyphens only"),
  description: z.string().optional(),
  thumbnail: z.string().url("Must be a valid URL").optional().or(z.literal("")),
});

type CreateCourseFormData = z.infer<typeof createCourseSchema>;

interface CreateCourseModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateCourseModal({ onClose, onSuccess }: CreateCourseModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCourseFormData>({
    resolver: zodResolver(createCourseSchema),
  });

  const titleValue = watch("title");

  const generateSlug = () => {
    if (!titleValue) return;
    const slug = titleValue
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim();
    setValue("slug", slug);
  };

  const onSubmit = async (data: CreateCourseFormData) => {
    try {
      setIsSubmitting(true);
      await courseService.createCourse({
        title: data.title,
        slug: data.slug,
        description: data.description || undefined,
        thumbnail: data.thumbnail || undefined,
      });
      onSuccess();
    } catch (error) {
      alert("Failed to create course: " + getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4">
          <h2 className="text-xl font-semibold text-dark-text">Create New Course</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="Enter course title"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Slug <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-2">
              <input
                {...register("slug")}
                type="text"
                className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
                placeholder="course-slug-here"
              />
              <button
                type="button"
                onClick={generateSlug}
                className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text hover:bg-dark-border transition-colors"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-dark-muted mt-1">
              URL-friendly identifier (lowercase, hyphens only)
            </p>
            {errors.slug && <p className="text-red-500 text-sm mt-1">{errors.slug.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Description</label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="Enter course description"
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Thumbnail URL (Cloudinary)
            </label>
            <input
              {...register("thumbnail")}
              type="text"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="https://res.cloudinary.com/..."
            />
            <p className="text-xs text-dark-muted mt-1">
              Upload image to Cloudinary first, then paste the URL here
            </p>
            {errors.thumbnail && (
              <p className="text-red-500 text-sm mt-1">{errors.thumbnail.message}</p>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text hover:bg-dark-border transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Course"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
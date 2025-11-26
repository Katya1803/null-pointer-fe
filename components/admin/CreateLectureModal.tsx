"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lectureService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { LectureType } from "@/lib/types/course.types";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

const createLectureSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  type: z.enum(["VIDEO", "ARTICLE"]),
  videoUrl: z.string().optional(),
  duration: z.number().int().min(0).optional().or(z.nan()),
  sortOrder: z.number().int().min(0),
  isPreview: z.boolean(),
});

type CreateLectureFormData = z.infer<typeof createLectureSchema>;

interface CreateLectureModalProps {
  sectionId: string;
  nextSortOrder: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateLectureModal({
  sectionId,
  nextSortOrder,
  onClose,
  onSuccess,
}: CreateLectureModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articleContent, setArticleContent] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<CreateLectureFormData>({
    resolver: zodResolver(createLectureSchema),
    defaultValues: {
      type: "VIDEO",
      sortOrder: nextSortOrder,
      isPreview: false,
    },
  });

  const lectureType = watch("type");

  const onSubmit = async (data: CreateLectureFormData) => {
    // Validate content based on type
    if (data.type === "ARTICLE" && !articleContent.trim()) {
      alert("Article content is required");
      return;
    }
    
    if (data.type === "VIDEO" && !data.videoUrl) {
      alert("Video URL is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      const payload = {
        title: data.title,
        type: data.type as LectureType,
        content: data.type === "ARTICLE" ? articleContent : undefined,
        videoUrl: data.type === "VIDEO" ? data.videoUrl : undefined,
        duration: data.duration,
        sortOrder: data.sortOrder,
        isPreview: data.isPreview,
      };
      
      console.log("Creating lecture with payload:", payload);
      
      await lectureService.createLecture(sectionId, payload);
      onSuccess();
    } catch (error) {
      console.error("Failed to create lecture:", error);
      alert("Failed to create lecture: " + getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4">
          <h2 className="text-xl font-semibold text-dark-text">Create Lecture</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Lecture Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="e.g., Introduction to Spring Boot"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Lecture Type <span className="text-red-500">*</span>
            </label>
            <select
              {...register("type")}
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
            >
              <option value="VIDEO">Video</option>
              <option value="ARTICLE">Article</option>
            </select>
            {errors.type && <p className="text-red-500 text-sm mt-1">{errors.type.message}</p>}
          </div>

          {lectureType === "VIDEO" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  YouTube Video URL <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("videoUrl")}
                  type="text"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
                <p className="text-xs text-dark-muted mt-1">
                  Upload video to YouTube (unlisted), then paste URL here
                </p>
                {errors.videoUrl && (
                  <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  Duration (seconds)
                </label>
                <input
                  {...register("duration", { valueAsNumber: true })}
                  type="number"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
                  placeholder="e.g., 300 (5 minutes)"
                />
                {errors.duration && (
                  <p className="text-red-500 text-sm mt-1">{errors.duration.message}</p>
                )}
              </div>
            </>
          ) : (
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Article Content
              </label>
              <TiptapEditor content={articleContent} onChange={setArticleContent} />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Sort Order</label>
            <input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
            />
            <p className="text-xs text-dark-muted mt-1">Position in the section (0-based)</p>
            {errors.sortOrder && (
              <p className="text-red-500 text-sm mt-1">{errors.sortOrder.message}</p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register("isPreview")}
              type="checkbox"
              id="isPreview"
              className="w-4 h-4 text-primary-500 bg-dark-bg border-dark-border rounded focus:ring-primary-500"
            />
            <label htmlFor="isPreview" className="text-sm text-dark-text">
              Allow preview without enrollment
            </label>
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
              {isSubmitting ? "Creating..." : "Create Lecture"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
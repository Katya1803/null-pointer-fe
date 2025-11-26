"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { lectureService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { LectureResponse } from "@/lib/types/course.types";
import { TiptapEditor } from "@/components/editor/TiptapEditor";

const updateLectureSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must not exceed 200 characters"),
  videoUrl: z.string().optional(),
  duration: z.number().int().min(0).optional().or(z.nan()),
  sortOrder: z.number().int().min(0),
  isPreview: z.boolean(),
});

type UpdateLectureFormData = z.infer<typeof updateLectureSchema>;

interface EditLectureModalProps {
  lecture: LectureResponse;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditLectureModal({ lecture, onClose, onSuccess }: EditLectureModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [articleContent, setArticleContent] = useState(lecture.content || "");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateLectureFormData>({
    resolver: zodResolver(updateLectureSchema),
    defaultValues: {
      title: lecture.title,
      videoUrl: lecture.videoUrl || "",
      duration: lecture.duration || 0,
      sortOrder: lecture.sortOrder,
      isPreview: lecture.isPreview,
    },
  });

  const onSubmit = async (data: UpdateLectureFormData) => {
    // Validate content based on type
    if (lecture.type === "ARTICLE" && !articleContent.trim()) {
      alert("Article content is required");
      return;
    }
    
    if (lecture.type === "VIDEO" && !data.videoUrl) {
      alert("Video URL is required");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await lectureService.updateLecture(lecture.id, {
        title: data.title,
        content: lecture.type === "ARTICLE" ? articleContent : undefined,
        videoUrl: lecture.type === "VIDEO" ? data.videoUrl : undefined,
        duration: data.duration,
        sortOrder: data.sortOrder,
        isPreview: data.isPreview,
      });
      alert("Lecture updated successfully!");
      onSuccess();
    } catch (error) {
      alert("Failed to update lecture: " + getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4">
          <h2 className="text-xl font-semibold text-dark-text">Edit Lecture</h2>
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
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Type</label>
            <input
              type="text"
              value={lecture.type}
              disabled
              className="w-full px-4 py-2 bg-dark-border border border-dark-border rounded text-dark-muted cursor-not-allowed"
            />
            <p className="text-xs text-dark-muted mt-1">Type cannot be changed after creation</p>
          </div>

          {lecture.type === "VIDEO" ? (
            <>
              <div>
                <label className="block text-sm font-medium text-dark-text mb-2">
                  YouTube Video URL
                </label>
                <input
                  {...register("videoUrl")}
                  type="text"
                  className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
                  placeholder="https://www.youtube.com/watch?v=..."
                />
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
              {isSubmitting ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
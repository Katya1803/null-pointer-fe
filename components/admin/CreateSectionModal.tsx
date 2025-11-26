"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { sectionService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";

const createSectionSchema = z.object({
  title: z.string().min(1, "Title is required").max(150, "Title must not exceed 150 characters"),
  sortOrder: z.number().int().min(0),
});

type CreateSectionFormData = z.infer<typeof createSectionSchema>;

interface CreateSectionModalProps {
  courseId: string;
  nextSortOrder: number;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreateSectionModal({
  courseId,
  nextSortOrder,
  onClose,
  onSuccess,
}: CreateSectionModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateSectionFormData>({
    resolver: zodResolver(createSectionSchema),
    defaultValues: {
      sortOrder: nextSortOrder,
    },
  });

  const onSubmit = async (data: CreateSectionFormData) => {
    try {
      setIsSubmitting(true);
      await sectionService.createSection(courseId, data);
      onSuccess();
    } catch (error) {
      alert("Failed to create section: " + getErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-md w-full">
        <div className="border-b border-dark-border px-6 py-4">
          <h2 className="text-xl font-semibold text-dark-text">Create Section</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Section Title <span className="text-red-500">*</span>
            </label>
            <input
              {...register("title")}
              type="text"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
              placeholder="e.g., Getting Started"
            />
            {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">Sort Order</label>
            <input
              {...register("sortOrder", { valueAsNumber: true })}
              type="number"
              className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text focus:outline-none focus:border-primary-500"
            />
            <p className="text-xs text-dark-muted mt-1">Position in the course (0-based)</p>
            {errors.sortOrder && (
              <p className="text-red-500 text-sm mt-1">{errors.sortOrder.message}</p>
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
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
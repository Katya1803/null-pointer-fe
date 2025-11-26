"use client";

import { useState, useEffect } from "react";
import { courseService, sectionService, lectureService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { CourseDetail, SectionResponse } from "@/lib/types/course.types";
import { EditCourseBasicInfo } from "./EditCourseBasicInfo";
import { CourseSectionsList } from "./CourseSectionsList";

interface EditCourseModalProps {
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function EditCourseModal({ courseId, onClose, onSuccess }: EditCourseModalProps) {
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [sections, setSections] = useState<SectionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"basic" | "content">("basic");

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getCourseById(courseId);
      setCourse(data.data);
      await fetchSections(data.data.id);
    } catch (error) {
      console.error("Failed to fetch course:", error);
      alert("Failed to load course: " + getErrorMessage(error));
      onClose();
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (courseIdToFetch: string) => {
    try {
      const { data } = await sectionService.getSectionsByCourseId(courseIdToFetch);
      setSections(data.data);
    } catch (error) {
      console.error("Failed to fetch sections:", error);
    }
  };

  const handleBasicInfoUpdated = () => {
    fetchCourse();
  };

  const handleSectionsUpdated = () => {
    if (course) {
      fetchSections(course.id);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-dark-card border border-dark-border rounded-lg p-8">
          <p className="text-dark-text">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-dark-card border border-dark-border rounded-lg max-w-6xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="sticky top-0 bg-dark-card border-b border-dark-border px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-dark-text">Edit Course: {course.title}</h2>
            <button
              onClick={onClose}
              className="text-dark-muted hover:text-dark-text transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="flex gap-4 mt-4">
            <button
              onClick={() => setActiveTab("basic")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "basic"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-dark-muted hover:text-dark-text"
              }`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab("content")}
              className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                activeTab === "content"
                  ? "border-primary-500 text-primary-500"
                  : "border-transparent text-dark-muted hover:text-dark-text"
              }`}
            >
              Sections & Lectures
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "basic" ? (
            <EditCourseBasicInfo course={course} onSuccess={handleBasicInfoUpdated} />
          ) : (
            <CourseSectionsList
              courseId={course.id}
              sections={sections}
              onUpdate={handleSectionsUpdated}
            />
          )}
        </div>
      </div>
    </div>
  );
}
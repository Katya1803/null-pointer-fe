"use client";

import { useState, useEffect } from "react";
import { courseService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { CourseListItem } from "@/lib/types/course.types";
import { CreateCourseModal } from "./CreateCourseModal";
import { EditCourseModal } from "./EditCourseModal";

export function CoursesTab() {
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [statusFilter, setStatusFilter] = useState<string>("");

  useEffect(() => {
    fetchCourses();
  }, [currentPage, statusFilter]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getAllCoursesForAdmin(
        currentPage,
        20,
        statusFilter || undefined
      );
      setCourses(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseCreated = () => {
    setShowCreateModal(false);
    fetchCourses();
  };

  const handleCourseUpdated = () => {
    setEditingCourseId(null);
    fetchCourses();
  };

  const handleDelete = async (courseId: string, courseTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${courseTitle}"?`)) {
      return;
    }

    try {
      await courseService.deleteCourse(courseId);
      fetchCourses();
    } catch (error) {
      alert("Failed to delete course: " + getErrorMessage(error));
    }
  };

  const handleStatusChange = async (courseId: string, newStatus: "DRAFT" | "PUBLISHED") => {
    try {
      await courseService.updateCourseStatus(courseId, { status: newStatus });
      fetchCourses();
    } catch (error) {
      alert("Failed to update status: " + getErrorMessage(error));
    }
  };

  if (loading) {
    return (
      <div className="text-center py-12 text-dark-muted">
        <p>Loading courses...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div className="flex gap-4 items-center">
          <h2 className="text-xl font-semibold text-dark-text">Courses Management</h2>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(0);
            }}
            className="px-3 py-1 bg-dark-bg border border-dark-border rounded text-dark-text text-sm"
          >
            <option value="">All Status</option>
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
          </select>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-primary-500 hover:bg-primary-600 text-white rounded transition-colors"
        >
          Create Course
        </button>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-12 text-dark-muted">
          <p>No courses found</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="bg-dark-card border border-dark-border rounded-lg p-4"
              >
                <div className="flex gap-4">
                  {course.thumbnail && (
                    <img
                      src={course.thumbnail}
                      alt={course.title}
                      className="w-32 h-20 object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-lg font-semibold text-dark-text">
                          {course.title}
                        </h3>
                        <p className="text-sm text-dark-muted">/{course.slug}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          course.status === "PUBLISHED"
                            ? "bg-green-500/20 text-green-500"
                            : "bg-yellow-500/20 text-yellow-500"
                        }`}
                      >
                        {course.status}
                      </span>
                    </div>
                    <p className="text-dark-muted text-sm mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-dark-muted">
                      <span>{course.totalSections} sections</span>
                      <span>{course.totalLectures} lectures</span>
                      <span>Created: {new Date(course.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-dark-border">
                  <button
                    onClick={() => setEditingCourseId(course.id)}
                    className="px-3 py-1 bg-dark-bg hover:bg-dark-border text-dark-text rounded text-sm transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      handleStatusChange(
                        course.id,
                        course.status === "PUBLISHED" ? "DRAFT" : "PUBLISHED"
                      )
                    }
                    className="px-3 py-1 bg-dark-bg hover:bg-dark-border text-dark-text rounded text-sm transition-colors"
                  >
                    {course.status === "PUBLISHED" ? "Unpublish" : "Publish"}
                  </button>
                  <button
                    onClick={() => handleDelete(course.id, course.title)}
                    className="px-3 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-500 rounded text-sm transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-6">
              <button
                onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                disabled={currentPage === 0}
                className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <span className="px-4 py-2 text-dark-text">
                Page {currentPage + 1} of {totalPages}
              </span>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                disabled={currentPage === totalPages - 1}
                className="px-4 py-2 bg-dark-bg border border-dark-border rounded text-dark-text disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {showCreateModal && (
        <CreateCourseModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCourseCreated}
        />
      )}

      {editingCourseId && (
        <EditCourseModal
          courseId={editingCourseId}
          onClose={() => setEditingCourseId(null)}
          onSuccess={handleCourseUpdated}
        />
      )}
    </div>
  );
}
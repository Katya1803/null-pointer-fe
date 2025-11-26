"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { CourseListItem } from "@/lib/types/course.types";

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCourses();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getPublishedCourses(currentPage, 12);
      setCourses(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Failed to load courses: " + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Available Courses</h2>
          <p className="text-dark-muted">
            Choose from our collection of free courses designed for Java developers
          </p>
        </div>

        {courses.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-muted text-lg">No courses available yet. Check back soon!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div
                  key={course.id}
                  onClick={() => router.push(`/courses/${course.slug}`)}
                  className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-primary-500 transition-colors cursor-pointer group"
                >
                  {/* Thumbnail */}
                  {course.thumbnail ? (
                    <div className="aspect-video bg-dark-bg overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {course.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-500 transition-colors">
                      {course.title}
                    </h3>
                    
                    {course.description && (
                      <p className="text-dark-muted text-sm mb-4 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-dark-muted">
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>{course.totalSections} sections</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        <span>{course.totalLectures} lectures</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-dark-muted">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage === totalPages - 1}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded-lg text-dark-text hover:border-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
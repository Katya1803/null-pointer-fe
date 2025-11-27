"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { enrollmentService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { useAuthStore } from "@/lib/store/auth-store";
import type { EnrollmentDetail } from "@/lib/types/course.types";

export default function MyLearningPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const [enrollments, setEnrollments] = useState<EnrollmentDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (!user) {
      router.push("/login");
      return;
    }
    fetchEnrollments();
  }, [user, currentPage]);

  const fetchEnrollments = async () => {
    try {
      setLoading(true);
      const { data } = await enrollmentService.getMyEnrollments(currentPage, 12);
      setEnrollments(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch enrollments:", error);
      alert("Failed to load enrollments: " + getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading your courses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">My Learning</h1>
          <p className="text-dark-muted">
            Continue your learning journey with your enrolled courses
          </p>
        </div>

        {enrollments.length === 0 ? (
          <div className="text-center py-16 bg-dark-card border border-dark-border rounded-lg">
            <svg className="w-16 h-16 text-dark-muted mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            <h3 className="text-xl font-semibold text-white mb-2">No enrolled courses yet</h3>
            <p className="text-dark-muted mb-6">Start learning by enrolling in a course</p>
            <button
              onClick={() => router.push("/")}
              className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <div
                  key={enrollment.id}
                  onClick={() => router.push(`/courses/${enrollment.course.slug}`)}
                  className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-primary-500 transition-colors cursor-pointer group"
                >
                  {/* Thumbnail */}
                  {enrollment.course.thumbnail ? (
                    <div className="aspect-video bg-dark-bg overflow-hidden">
                      <img
                        src={enrollment.course.thumbnail}
                        alt={enrollment.course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                      <span className="text-white text-4xl font-bold">
                        {enrollment.course.title.charAt(0)}
                      </span>
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-white mb-4 group-hover:text-primary-500 transition-colors">
                      {enrollment.course.title}
                    </h3>

                    {/* Progress Bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-2">
                        <span className="text-dark-muted">Progress</span>
                        <span className="text-primary-500 font-medium">
                          {Math.round(enrollment.progressPercentage)}%
                        </span>
                      </div>
                      <div className="w-full bg-dark-bg rounded-full h-2">
                        <div
                          className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${enrollment.progressPercentage}%` }}
                        />
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center justify-between text-sm text-dark-muted">
                      <span>{enrollment.course.totalLectures} lectures</span>
                      {enrollment.completedAt ? (
                        <span className="px-2 py-1 bg-primary-500/20 text-primary-500 rounded text-xs">
                          Completed
                        </span>
                      ) : (
                        <span>In Progress</span>
                      )}
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
      </div>
    </div>
  );
}
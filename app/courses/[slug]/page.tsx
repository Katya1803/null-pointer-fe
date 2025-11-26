"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { courseService, enrollmentService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useToast } from "@/lib/hooks/useToast";
import type { CourseDetail } from "@/lib/types/course.types";

export default function CourseDetailPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const { user } = useAuthStore();
  const toast = useToast();

  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchCourse();
  }, [slug]);

  useEffect(() => {
    if (user && course) {
      checkEnrollment();
    }
  }, [user, course]);

  const fetchCourse = async () => {
    try {
      setLoading(true);
      const { data } = await courseService.getCourseBySlug(slug);
      setCourse(data.data);
      // Expand first section by default
      if (data.data.sections && data.data.sections.length > 0) {
        setExpandedSections(new Set([data.data.sections[0].id]));
      }
    } catch (error) {
      console.error("Failed to fetch course:", error);
      alert("Failed to load course: " + getErrorMessage(error));
      router.push("/");
    } finally {
      setLoading(false);
    }
  };

  const checkEnrollment = async () => {
    if (!course) return;
    try {
      const { data } = await enrollmentService.checkEnrollment(course.id);
      setIsEnrolled(data.data);
    } catch (error) {
      console.error("Failed to check enrollment:", error);
    }
  };

  const handleEnroll = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!course) return;

    try {
      setEnrolling(true);
      await enrollmentService.enrollInCourse({ courseId: course.id });
      setIsEnrolled(true);
    } catch (error) {
      console.error("Failed to enroll: " + getErrorMessage(error));
    } finally {
      setEnrolling(false);
    }
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  };

  const handleLectureClick = (lectureId: string, isPreview: boolean) => {
    if (isPreview || isEnrolled) {
      router.push(`/courses/${slug}/lectures/${lectureId}`);
    } else {
      toast.warning("Please enroll in this course to access this lecture");
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading course...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Course Header */}
      <div className="bg-gradient-to-b from-dark-card to-dark-bg border-b border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <button
            onClick={() => router.push("/")}
            className="text-primary-500 hover:text-primary-400 mb-6 flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Courses
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left: Course Info */}
            <div className="lg:col-span-2">
              <h1 className="text-4xl font-bold text-white mb-4">{course.title}</h1>

              {course.description && (
                <p className="text-dark-muted text-lg mb-6">{course.description}</p>
              )}

              <div className="flex items-center gap-6 text-sm text-dark-muted">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{course.totalSections} sections</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                  <span>{course.totalLectures} lectures</span>
                </div>
              </div>
            </div>

            {/* Right: Thumbnail & CTA */}
            <div className="lg:col-span-1">
              {course.thumbnail ? (
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full rounded-lg shadow-lg mb-4"
                />
              ) : (
                <div className="w-full aspect-video bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-white text-6xl font-bold">{course.title.charAt(0)}</span>
                </div>
              )}

              {user ? (
                isEnrolled ? (
                  <div className="bg-primary-500/20 border border-primary-500 rounded-lg p-4 text-center">
                    <p className="text-primary-500 font-medium mb-2">✓ Enrolled</p>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={enrolling}
                    className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
                  >
                    {enrolling ? "Enrolling..." : "Enroll for Free"}
                  </button>
                )
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="w-full px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg font-medium transition-colors"
                >
                  Sign in to Enroll
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold text-white mb-6">Course Content</h2>

        {course.sections && course.sections.length > 0 ? (
          <div className="space-y-4">
            {course.sections.map((section, index) => (
              <div key={section.id} className="bg-dark-card border border-dark-border rounded-lg overflow-hidden">
                {/* Section Header */}
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-bg transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <svg
                      className={`w-5 h-5 text-dark-muted transition-transform ${expandedSections.has(section.id) ? 'rotate-90' : ''}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    <div className="text-left">
                      <h3 className="text-lg font-semibold text-white">
                        Section {index + 1}: {section.title}
                      </h3>
                      <p className="text-sm text-dark-muted">
                        {section.lectures.length} {section.lectures.length === 1 ? 'lecture' : 'lectures'}
                      </p>
                    </div>
                  </div>
                </button>

                {/* Lectures List */}
                {expandedSections.has(section.id) && (
                  <div className="border-t border-dark-border">
                    {section.lectures.map((lecture) => (
                      <button
                        key={lecture.id}
                        onClick={() => handleLectureClick(lecture.id, lecture.isPreview)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-dark-bg transition-colors text-left group"
                      >
                        <div className="flex items-center gap-4">
                          {/* Lecture Icon */}
                          <div className="w-10 h-10 rounded-lg bg-dark-bg flex items-center justify-center group-hover:bg-primary-500 transition-colors">
                            {lecture.type === "VIDEO" ? (
                              <svg className="w-5 h-5 text-dark-muted group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : (
                              <svg className="w-5 h-5 text-dark-muted group-hover:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                          </div>

                          <div>
                            <p className="text-white group-hover:text-primary-500 transition-colors">
                              {lecture.title}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-dark-muted">
                              <span className="capitalize">{lecture.type.toLowerCase()}</span>
                              {lecture.duration && (
                                <>
                                  <span>•</span>
                                  <span>{Math.floor(lecture.duration / 60)} min</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {lecture.isPreview && (
                            <span className="px-2 py-1 bg-primary-500/20 text-primary-500 text-xs rounded">
                              Preview
                            </span>
                          )}
                          {!lecture.isPreview && !isEnrolled && (
                            <svg className="w-5 h-5 text-dark-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-dark-card border border-dark-border rounded-lg">
            <p className="text-dark-muted">No course content available yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
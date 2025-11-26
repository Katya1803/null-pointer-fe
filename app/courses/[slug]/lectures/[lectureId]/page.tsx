"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { lectureService, courseService, lectureProgressService, enrollmentService } from "@/lib/services/course.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { useAuthStore } from "@/lib/store/auth-store";
import { useToast } from "@/lib/hooks/useToast";
import type { LectureResponse, CourseDetail, CourseProgressDetail } from "@/lib/types/course.types";

export default function LecturePage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;
  const lectureId = params.lectureId as string;
  const { user } = useAuthStore();

  const [lecture, setLecture] = useState<LectureResponse | null>(null);
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentSectionIndex, setCurrentSectionIndex] = useState(0);
  const [currentLectureIndex, setCurrentLectureIndex] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarking, setIsMarking] = useState(false);

  const toast = useToast();
  
  useEffect(() => {
    fetchData();
  }, [lectureId]);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch lecture
      const lectureResponse = await lectureService.getLectureById(lectureId);
      setLecture(lectureResponse.data.data);

      // Fetch course to get navigation
      const courseResponse = await courseService.getCourseBySlug(slug);
      setCourse(courseResponse.data.data);

      // Fetch course progress if user is logged in
      if (user) {
        try {
          const progressResponse = await enrollmentService.getCourseProgress(courseResponse.data.data.id);
          setCourseProgress(progressResponse.data.data);
          
          // Check if current lecture is completed
          const lectureProgress = progressResponse.data.data.sections
            .flatMap(s => s.lectures)
            .find(l => l.lectureId === lectureId);
          
          setIsCompleted(lectureProgress?.isCompleted || false);
        } catch (error) {
          console.error("Failed to fetch progress:", error);
          // User might not be enrolled yet, that's OK
        }
      }

      // Find current position
      const sections = courseResponse.data.data.sections;
      for (let i = 0; i < sections.length; i++) {
        const lectureIdx = sections[i].lectures.findIndex(l => l.id === lectureId);
        if (lectureIdx !== -1) {
          setCurrentSectionIndex(i);
          setCurrentLectureIndex(lectureIdx);
          break;
        }
      }
    } catch (error) {
      console.error("Failed to fetch lecture:", error);
      alert("Failed to load lecture: " + getErrorMessage(error));
      router.push(`/courses/${slug}`);
    } finally {
      setLoading(false);
    }
  };

  const markAsComplete = async () => {
    if (!user || isMarking) return;
    
    try {
      setIsMarking(true);
      await lectureProgressService.markAsComplete(lectureId);
      
      // Update local state
      setIsCompleted(true);
      
      // Refetch course progress to update sidebar
      if (course) {
        const progressResponse = await enrollmentService.getCourseProgress(course.id);
        setCourseProgress(progressResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to mark complete:", error);
      toast.error("Failed to mark as complete: " + getErrorMessage(error));
    } finally {
      setIsMarking(false);
    }
  };

  const navigateToLecture = (sectionIdx: number, lectureIdx: number) => {
    if (!course) return;
    const section = course.sections[sectionIdx];
    if (!section) return;
    const lecture = section.lectures[lectureIdx];
    if (!lecture) return;

    router.push(`/courses/${slug}/lectures/${lecture.id}`);
  };

  const goToNextLecture = () => {
    if (!course) return;
    const currentSection = course.sections[currentSectionIndex];

    // Check if there's next lecture in current section
    if (currentLectureIndex < currentSection.lectures.length - 1) {
      navigateToLecture(currentSectionIndex, currentLectureIndex + 1);
    }
    // Move to next section
    else if (currentSectionIndex < course.sections.length - 1) {
      navigateToLecture(currentSectionIndex + 1, 0);
    }
  };

  const goToPreviousLecture = () => {
    if (!course) return;

    // Check if there's previous lecture in current section
    if (currentLectureIndex > 0) {
      navigateToLecture(currentSectionIndex, currentLectureIndex - 1);
    }
    // Move to previous section
    else if (currentSectionIndex > 0) {
      const prevSection = course.sections[currentSectionIndex - 1];
      navigateToLecture(currentSectionIndex - 1, prevSection.lectures.length - 1);
    }
  };

  const hasNextLecture = () => {
    if (!course) return false;
    const currentSection = course.sections[currentSectionIndex];
    return (
      currentLectureIndex < currentSection.lectures.length - 1 ||
      currentSectionIndex < course.sections.length - 1
    );
  };

  const hasPreviousLecture = () => {
    return currentSectionIndex > 0 || currentLectureIndex > 0;
  };

  const isLectureCompleted = (lecId: string): boolean => {
    if (!courseProgress) return false;
    
    const lectureProgress = courseProgress.sections
      .flatMap(s => s.lectures)
      .find(l => l.lectureId === lecId);
    
    return lectureProgress?.isCompleted || false;
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-dark-bg">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading lecture...</p>
        </div>
      </div>
    );
  }

  if (!lecture || !course) {
    return null;
  }

  return (
    <div className="min-h-screen bg-dark-bg flex flex-col">
      {/* Header */}
      <div className="bg-dark-card border-b border-dark-border">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.push(`/courses/${slug}`)}
              className="text-primary-500 hover:text-primary-400 flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Course
            </button>

            <h1 className="text-xl font-semibold text-white truncate max-w-md">
              {course.title}
            </h1>

            {user && (
              <button
                onClick={markAsComplete}
                disabled={isCompleted || isMarking}
                className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                  isCompleted 
                    ? 'bg-green-500/20 text-green-500 cursor-default'
                    : 'bg-primary-500 hover:bg-primary-600 text-white'
                } ${isMarking ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isCompleted ? '✓ Completed' : isMarking ? 'Marking...' : 'Mark Complete'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video/Article Content */}
        <div className="flex-1 overflow-y-auto">
          {lecture.type === "VIDEO" ? (
            <>
              {/* Video Player */}
              <div className="bg-black">
                {lecture.videoUrl ? (
                  <div className="aspect-video max-w-6xl mx-auto">
                    <iframe
                      src={lecture.videoUrl}
                      title={lecture.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="w-full h-full"
                    />
                  </div>
                ) : (
                  <div className="aspect-video max-w-6xl mx-auto flex items-center justify-center bg-dark-card">
                    <p className="text-dark-muted">No video available</p>
                  </div>
                )}
              </div>

              {/* Lecture Info & Navigation */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold text-white mb-4">{lecture.title}</h2>

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-dark-border">
                  <button
                    onClick={goToPreviousLecture}
                    disabled={!hasPreviousLecture()}
                    className="px-6 py-3 bg-dark-card hover:bg-dark-border text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Lecture
                  </button>

                  <button
                    onClick={goToNextLecture}
                    disabled={!hasNextLecture()}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next Lecture
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Article Content */}
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h2 className="text-3xl font-bold text-white mb-8">{lecture.title}</h2>

                {lecture.content && (
                  <div
                    className="prose prose-invert max-w-none mb-12"
                    dangerouslySetInnerHTML={{ __html: lecture.content }}
                  />
                )}

                {/* Navigation */}
                <div className="flex items-center justify-between mt-12 pt-8 border-t border-dark-border">
                  <button
                    onClick={goToPreviousLecture}
                    disabled={!hasPreviousLecture()}
                    className="px-6 py-3 bg-dark-card hover:bg-dark-border text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Previous Lecture
                  </button>

                  <button
                    onClick={goToNextLecture}
                    disabled={!hasNextLecture()}
                    className="px-6 py-3 bg-primary-500 hover:bg-primary-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                  >
                    Next Lecture
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sidebar - Course Navigation */}
        <div className="w-80 bg-dark-card border-l border-dark-border overflow-y-auto">
          <div className="p-4 border-b border-dark-border">
            <h3 className="font-semibold text-white">Course Content</h3>
          </div>

          <div className="p-4 space-y-2">
            {course.sections.map((section, sectionIdx) => (
              <div key={section.id}>
                <h4 className="text-sm font-medium text-dark-muted mb-2 px-2">
                  Section {sectionIdx + 1}: {section.title}
                </h4>

                {section.lectures.map((lec, lecIdx) => {
                  const completed = isLectureCompleted(lec.id);
                  const isCurrent = lec.id === lectureId;
                  
                  return (
                    <button
                      key={lec.id}
                      onClick={() => navigateToLecture(sectionIdx, lecIdx)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        isCurrent
                          ? 'bg-primary-500 text-white'
                          : 'text-dark-text hover:bg-dark-bg'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {/* Lecture type icon */}
                        {lec.type === "VIDEO" ? (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        
                        <span className="truncate flex-1">{lec.title}</span>
                        
                        {/* Completed checkmark */}
                        {completed && (
                          <svg 
                            className={`w-4 h-4 flex-shrink-0 ${isCurrent ? 'text-white' : 'text-green-500'}`} 
                            fill="currentColor" 
                            viewBox="0 0 20 20"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
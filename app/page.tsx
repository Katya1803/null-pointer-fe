"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { courseService } from "@/lib/services/course.service";
import { seriesService } from "@/lib/services/blog.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { CourseListItem } from "@/lib/types/course.types";
import type { SeriesDetail } from "@/lib/types/blog.types";

export default function HomePage() {
  const router = useRouter();
  const [courses, setCourses] = useState<CourseListItem[]>([]);
  const [series, setSeries] = useState<SeriesDetail[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    fetchCourses();
    fetchSeries();
  }, [currentPage]);

  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      const { data } = await courseService.getPublishedCourses(currentPage, 12);
      setCourses(data.data.content);
      setTotalPages(data.data.totalPages);
    } catch (error) {
      console.error("Failed to fetch courses:", error);
      alert("Failed to load courses: " + getErrorMessage(error));
    } finally {
      setCoursesLoading(false);
    }
  };

  const fetchSeries = async () => {
    try {
      setSeriesLoading(true);
      
      // Step 1: Get all series IDs
      const { data } = await seriesService.getAllSeries();
      const seriesList = data.data;
      
      // Step 2: Fetch details for first 6 series
      const seriesDetails = await Promise.all(
        seriesList.slice(0, 6).map(async (item) => {
          try {
            const detailResponse = await seriesService.getSeriesById(item.id);
            return detailResponse.data.data;
          } catch (error) {
            console.error(`Failed to fetch series ${item.id}:`, error);
            return null;
          }
        })
      );
      
      // Filter out failed requests
      setSeries(seriesDetails.filter((s): s is SeriesDetail => s !== null));
    } catch (error) {
      console.error("Failed to fetch series:", error);
    } finally {
      setSeriesLoading(false);
    }
  };

  if (coursesLoading && seriesLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg">

      {/* Series Section */}
      <section id="series" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 border-b border-dark-border">
        <div className="mb-12">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-white mb-4">Blog Series</h2>
              <p className="text-dark-muted">
                Explore our curated series of articles on Java and Spring Framework
              </p>
            </div>
            <button
              onClick={() => router.push("/blogs?tab=series")}
              className="text-primary-500 hover:text-primary-400 flex items-center gap-2"
            >
              View All
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>

        {seriesLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : series.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-dark-muted text-lg">No series available yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {series.map((seriesItem) => (
              <div
                key={seriesItem.id}
                onClick={() => router.push(`/blogs/series/${seriesItem.slug}`)}
                className="bg-dark-card border border-dark-border rounded-lg overflow-hidden hover:border-primary-500 transition-colors cursor-pointer group"
              >
                {/* Thumbnail */}
                {seriesItem.thumbnail ? (
                  <div className="aspect-video bg-dark-bg overflow-hidden">
                    <img
                      src={seriesItem.thumbnail}
                      alt={seriesItem.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-video bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center">
                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                )}

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-primary-500 transition-colors">
                    {seriesItem.title}
                  </h3>
                  
                  {seriesItem.description && (
                    <p className="text-dark-muted text-sm line-clamp-2">
                      {seriesItem.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Courses Section */}
      <section id="courses" className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">Available Courses</h2>
          <p className="text-dark-muted">
            Choose from our collection of free courses designed for Java developers
          </p>
        </div>

        {coursesLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent" />
          </div>
        ) : courses.length === 0 ? (
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

                    <div className="flex items-center gap-4 text-xs text-dark-muted">
                      <span>{course.totalSections} sections</span>
                      <span>•</span>
                      <span>{course.totalLectures} lectures</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                  disabled={currentPage === 0}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <span className="px-4 py-2 text-dark-text">
                  Page {currentPage + 1} of {totalPages}
                </span>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                  disabled={currentPage >= totalPages - 1}
                  className="px-4 py-2 bg-dark-card border border-dark-border rounded hover:border-primary-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
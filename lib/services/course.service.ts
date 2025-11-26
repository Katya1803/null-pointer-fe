import { api } from '../api';
import type { ApiResponse, PageResponse } from '@/lib/types/api.types';
import type {
  CourseListItem,
  CourseDetail,
  CourseCreateRequest,
  CourseUpdateRequest,
  CourseResponse,
  UpdateCourseStatusRequest,
  SectionResponse,
  SectionCreateRequest,
  SectionUpdateRequest,
  LectureResponse,
  LectureCreateRequest,
  LectureUpdateRequest,
  EnrollmentRequest,
  EnrollmentResponse,
  EnrollmentDetail,
  CourseProgressDetail,
  LectureProgressRequest,
  LectureProgressResponse,
} from '@/lib/types/course.types';

// ==================== Course Service ====================

export const courseService = {
  /**
   * Get all published courses (public access)
   */
  getPublishedCourses: (page: number = 0, size: number = 20, keyword?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (keyword) {
      params.append('keyword', keyword);
    }
    return api.get<ApiResponse<PageResponse<CourseListItem>>>(
      `/api/courses?${params.toString()}`
    );
  },

  /**
   * Get course by slug (public access)
   */
  getCourseBySlug: (slug: string) =>
    api.get<ApiResponse<CourseDetail>>(`/api/courses/${slug}`),

  /**
   * Get course by ID (admin access)
   */
  getCourseById: (courseId: string) =>
    api.get<ApiResponse<CourseDetail>>(`/api/courses/admin/${courseId}`),

  /**
   * Get all courses for admin (including drafts)
   */
  getAllCoursesForAdmin: (page: number = 0, size: number = 20, status?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (status) {
      params.append('status', status);
    }
    return api.get<ApiResponse<PageResponse<CourseListItem>>>(
      `/api/courses/admin/all?${params.toString()}`
    );
  },

  /**
   * Create course (admin only)
   */
  createCourse: (data: CourseCreateRequest) =>
    api.post<ApiResponse<CourseResponse>>('/api/courses', data),

  /**
   * Update course (admin only)
   */
  updateCourse: (courseId: string, data: CourseUpdateRequest) =>
    api.put<ApiResponse<CourseResponse>>(`/api/courses/${courseId}`, data),

  /**
   * Update course status (admin only)
   */
  updateCourseStatus: (courseId: string, data: UpdateCourseStatusRequest) =>
    api.patch<ApiResponse<CourseResponse>>(`/api/courses/${courseId}/status`, data),

  /**
   * Delete course (admin only)
   */
  deleteCourse: (courseId: string) =>
    api.delete<ApiResponse<void>>(`/api/courses/${courseId}`),
};

// ==================== Section Service ====================

export const sectionService = {
  /**
   * Create section for course (admin only)
   */
  createSection: (courseId: string, data: SectionCreateRequest) =>
    api.post<ApiResponse<SectionResponse>>(`/api/courses/${courseId}/sections`, data),

  /**
   * Update section (admin only)
   */
  updateSection: (sectionId: string, data: SectionUpdateRequest) =>
    api.put<ApiResponse<SectionResponse>>(`/api/courses/sections/${sectionId}`, data),

  /**
   * Delete section (admin only)
   */
  deleteSection: (sectionId: string) =>
    api.delete<ApiResponse<void>>(`/api/courses/sections/${sectionId}`),

  /**
   * Get sections by course ID
   */
  getSectionsByCourseId: (courseId: string) =>
    api.get<ApiResponse<SectionResponse[]>>(`/api/courses/${courseId}/sections`),
};

// ==================== Lecture Service (Admin) ====================

export const lectureService = {
  /**
   * Create lecture for section (admin only)
   */
  createLecture: (sectionId: string, data: LectureCreateRequest) =>
    api.post<ApiResponse<LectureResponse>>(`/api/courses/sections/${sectionId}/lectures`, data),

  /**
   * Update lecture (admin only)
   */
  updateLecture: (lectureId: string, data: LectureUpdateRequest) =>
    api.put<ApiResponse<LectureResponse>>(`/api/courses/lectures/${lectureId}`, data),

  /**
   * Delete lecture (admin only)
   */
  deleteLecture: (lectureId: string) =>
    api.delete<ApiResponse<void>>(`/api/courses/lectures/${lectureId}`),

  /**
   * Get lecture by ID
   */
  getLectureById: (lectureId: string) =>
    api.get<ApiResponse<LectureResponse>>(`/api/courses/lectures/${lectureId}`),

  /**
   * Get lectures by section ID
   */
  getLecturesBySectionId: (sectionId: string) =>
    api.get<ApiResponse<LectureResponse[]>>(`/api/courses/sections/${sectionId}/lectures`),
};

// ==================== Enrollment Service ====================

export const enrollmentService = {
  /**
   * Enroll in course (authenticated users)
   */
  enrollInCourse: (data: EnrollmentRequest) =>
    api.post<ApiResponse<EnrollmentResponse>>('/api/enrollments', data),

  /**
   * Get my enrollments (authenticated users)
   */
  getMyEnrollments: (page: number = 0, size: number = 20) =>
    api.get<ApiResponse<PageResponse<EnrollmentDetail>>>(
      `/api/enrollments/me?page=${page}&size=${size}`
    ),

  /**
   * Get course progress (authenticated users)
   */
  getCourseProgress: (courseId: string) =>
    api.get<ApiResponse<CourseProgressDetail>>(
      `/api/enrollments/${courseId}/progress`
    ),

  /**
   * Check if enrolled (authenticated users)
   */
  checkEnrollment: (courseId: string) =>
    api.get<ApiResponse<boolean>>(`/api/enrollments/${courseId}/check`),
};

// ==================== Lecture Progress Service ====================

export const lectureProgressService = {
  /**
   * Update lecture progress (authenticated users)
   */
  updateProgress: (lectureId: string, data: LectureProgressRequest) =>
    api.put<ApiResponse<LectureProgressResponse>>(
      `/api/enrollments/lectures/${lectureId}/progress`,
      data
    ),

  /**
   * Mark lecture as complete (authenticated users)
   */
  markAsComplete: (lectureId: string) =>
    api.post<ApiResponse<LectureProgressResponse>>(
      `/api/enrollments/lectures/${lectureId}/complete`
    ),

  /**
   * Get lecture progress (authenticated users)
   */
  getLectureProgress: (lectureId: string) =>
    api.get<ApiResponse<LectureProgressResponse>>(
      `/api/enrollments/lectures/${lectureId}/progress`
    ),
};
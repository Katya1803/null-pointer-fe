/**
 * Course Types - mapped from backend DTOs
 */

// ==================== Course Types ====================

export interface CourseListItem {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string; // Cloudinary URL
  status: CourseStatus;
  totalSections: number;
  totalLectures: number;
  createdAt: string;
}

export interface CourseDetail {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string; // Cloudinary URL
  status: CourseStatus;
  totalSections: number;
  totalLectures: number;
  createdAt: string;
  updatedAt: string;
  sections: SectionWithLectures[];
}

export interface CourseResponse {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnail: string; // Cloudinary URL
  status: CourseStatus;
  createdAt: string;
  updatedAt: string;
}

export type CourseStatus = 'DRAFT' | 'PUBLISHED';

// ==================== Course Request Types ====================

export interface CourseCreateRequest {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string; // Cloudinary URL
}

export interface CourseUpdateRequest {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string; // Cloudinary URL
}

export interface UpdateCourseStatusRequest {
  status: CourseStatus;
}

// ==================== Section Types ====================

export interface SectionWithLectures {
  id: string;
  title: string;
  sortOrder: number;
  lectures: LectureListItem[];
}

export interface SectionResponse {
  id: string;
  courseId: string;
  title: string;
  sortOrder: number;
  totalLectures: number;
  createdAt: string;
  updatedAt: string;
}

export interface SectionCreateRequest {
  title: string;
  sortOrder: number;
}

export interface SectionUpdateRequest {
  title?: string;
  sortOrder?: number;
}

// ==================== Lecture Types ====================

export interface LectureListItem {
  id: string;
  title: string;
  type: LectureType;
  duration: number; // in seconds
  sortOrder: number;
  isPreview: boolean;
}

export interface LectureResponse {
  id: string;
  sectionId: string;
  title: string;
  type: LectureType;
  content: string | null;
  videoUrl: string | null; // YouTube URL (unlisted)
  duration: number; // in seconds
  sortOrder: number;
  isPreview: boolean;
  createdAt: string;
  updatedAt: string;
}

export type LectureType = 'VIDEO' | 'ARTICLE' | 'QUIZ';

export interface LectureCreateRequest {
  title: string;
  type: LectureType;
  content?: string; // For ARTICLE type
  videoUrl?: string; // For VIDEO type (YouTube URL)
  duration?: number; // in seconds
  sortOrder: number;
  isPreview?: boolean;
}

export interface LectureUpdateRequest {
  title?: string;
  content?: string;
  videoUrl?: string;
  duration?: number;
  sortOrder?: number;
  isPreview?: boolean;
}

// ==================== Enrollment Types ====================

export interface EnrollmentRequest {
  courseId: string;
}

export interface EnrollmentResponse {
  id: string;
  accountId: string;
  courseId: string;
  enrolledAt: string;
  completedAt: string | null;
  progressPercentage: number;
}

export interface EnrollmentDetail {
  id: string;
  enrolledAt: string;
  completedAt: string | null;
  progressPercentage: number;
  course: CourseInfo;
}

export interface CourseInfo {
  id: string;
  title: string;
  slug: string;
  thumbnail: string; // Cloudinary URL
  totalLectures: number;
}

// ==================== Progress Types ====================

export interface LectureProgressRequest {
  isCompleted?: boolean;
  lastWatchedPosition?: number; // in seconds
}

export interface LectureProgressResponse {
  id: string;
  enrollmentId: string;
  lectureId: string;
  isCompleted: boolean;
  completedAt: string | null;
  lastWatchedPosition: number; // in seconds
}

export interface LectureProgressItem {
  lectureId: string;
  lectureTitle: string;
  lectureType: LectureType;
  duration: number; // in seconds
  sortOrder: number;
  isCompleted: boolean;
  completedAt: string | null;
  lastWatchedPosition: number; // in seconds
}

export interface CourseProgressDetail {
  enrollmentId: string;
  courseId: string;
  courseTitle: string;
  enrolledAt: string;
  completedAt: string | null;
  totalLectures: number;
  completedLectures: number;
  progressPercentage: number;
  sections: SectionProgressItem[];
}

export interface SectionProgressItem {
  sectionId: string;
  sectionTitle: string;
  sortOrder: number;
  lectures: LectureProgressItem[];
}
import { api } from '../api';
import type { ApiResponse, PageResponse } from '@/lib/types/api.types';
import type {
  PostListItem,
  PostDetail,
  PostCreateRequest,
  PostUpdateRequest,
  SeriesListItem,
  SeriesDetail,
  SeriesCreateRequest,
  SeriesUpdateRequest,
} from '@/lib/types/blog.types';

// Post Service
export const postService = {
  getPublishedPosts: (page: number = 0, size: number = 10, keyword?: string) => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    });
    if (keyword) {
      params.append('keyword', keyword);
    }
    return api.get<ApiResponse<PageResponse<PostListItem>>>(
      `/api/blogs/posts?${params.toString()}`
    );
  },

  getMyPosts: (page: number = 0, size: number = 10) =>
    api.get<ApiResponse<PageResponse<PostListItem>>>(
      `/api/blogs/posts/my-posts?page=${page}&size=${size}`
    ),

  getPendingPosts: (page: number = 0, size: number = 10) =>
    api.get<ApiResponse<PageResponse<PostListItem>>>(
      `/api/blogs/posts/pending?page=${page}&size=${size}`
    ),

  getPostById: (postId: string) =>
    api.get<ApiResponse<PostDetail>>(`/api/blogs/posts/${postId}`),

  getPostBySlug: (slug: string) =>
    api.get<ApiResponse<PostDetail>>(`/api/blogs/posts/slug/${slug}`),

  createPost: (data: PostCreateRequest) =>
    api.post<ApiResponse<PostDetail>>('/api/blogs/posts', data),

  updatePost: (postId: string, data: PostUpdateRequest) =>
    api.put<ApiResponse<PostDetail>>(`/api/blogs/posts/${postId}`, data),

  submitForReview: (postId: string) =>
    api.post<ApiResponse<PostDetail>>(`/api/blogs/posts/${postId}/submit`),

  approvePost: (postId: string) =>
    api.post<ApiResponse<PostDetail>>(`/api/blogs/posts/${postId}/approve`),

  rejectPost: (postId: string) =>
    api.post<ApiResponse<PostDetail>>(`/api/blogs/posts/${postId}/reject`),

  deletePost: (postId: string) =>
    api.delete<ApiResponse<void>>(`/api/blogs/posts/${postId}`),
};

// Series Service
export const seriesService = {
  getAllSeries: () =>
    api.get<ApiResponse<SeriesListItem[]>>('/api/blogs/series'),

  getSeriesById: (seriesId: string) =>
    api.get<ApiResponse<SeriesDetail>>(`/api/blogs/series/${seriesId}`),

  createSeries: (data: SeriesCreateRequest) =>
    api.post<ApiResponse<SeriesDetail>>('/api/blogs/series', data),

  updateSeries: (seriesId: string, data: SeriesUpdateRequest) =>
    api.put<ApiResponse<SeriesDetail>>(`/api/blogs/series/${seriesId}`, data),

  deleteSeries: (seriesId: string) =>
    api.delete<ApiResponse<void>>(`/api/blogs/series/${seriesId}`),
};
import { api } from '../api';
import type { ApiResponse, PageResponse } from '@/lib/types/api.types';
import type {
  EbookListItem,
  EbookDetail,
  EbookCreateRequest,
  EbookUpdateRequest,
} from '@/lib/types/ebook.types';

export const ebookService = {
  getEbooks: (page: number = 0, size: number = 12, keyword?: string) => {
    const params = new URLSearchParams();
    params.append('page', page.toString());
    params.append('size', size.toString());
    if (keyword) {
      params.append('keyword', keyword);
    }
    return api.get<ApiResponse<PageResponse<EbookListItem>>>(
      `/api/blogs/ebooks?${params.toString()}`
    );
  },

  getEbookById: (ebookId: string) =>
    api.get<ApiResponse<EbookDetail>>(`/api/blogs/ebooks/${ebookId}`),

  createEbook: (data: EbookCreateRequest) =>
    api.post<ApiResponse<EbookDetail>>('/api/blogs/ebooks', data),

  updateEbook: (ebookId: string, data: EbookUpdateRequest) =>
    api.put<ApiResponse<EbookDetail>>(`/api/blogs/ebooks/${ebookId}`, data),

  deleteEbook: (ebookId: string) =>
    api.delete<ApiResponse<void>>(`/api/blogs/ebooks/${ebookId}`),
};
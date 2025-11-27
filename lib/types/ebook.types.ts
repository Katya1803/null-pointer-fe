export interface EbookListItem {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
  coverUrl?: string;
}

export interface EbookDetail {
  id: string;
  title: string;
  author: string;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
  downloadUrl: string;
  createdAt: string;
}

export interface EbookCreateRequest {
  title: string;
  author: string;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
  downloadUrl: string;
}

export interface EbookUpdateRequest {
  title?: string;
  author?: string;
  publishedYear?: number;
  description?: string;
  coverUrl?: string;
  downloadUrl?: string;
}
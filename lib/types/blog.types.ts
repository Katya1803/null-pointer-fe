// Blog API Types matching backend DTOs

export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  author: string;
}

export interface AuthorDto {
  id: string;
  username: string;
  avatar: string | null;
}

export interface SeriesInfo {
  id: string;
  title: string;
  slug: string;
  orderInSeries: number | null;
}

export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  status: 'PUBLISHED' | 'DRAFT' | 'PENDING';
  createdAt: string;
  updatedAt: string;
  author: AuthorDto;
  series: SeriesInfo | null;
}

export interface PostCreateRequest {
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  seriesId?: string;
  orderInSeries?: number;
}

export interface PostUpdateRequest {
  title?: string;
  slug?: string;
  content?: string;
  status?: string;
  seriesId?: string;
  orderInSeries?: number;
}

export interface SeriesListItem {
  id: string;
  title: string;
  slug: string;
}

export interface SeriesPostItem {
  id: string;
  title: string;
  slug: string;
  order: number | null;
}

export interface SeriesDetail {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  thumbnail: string | null;
  posts: SeriesPostItem[];
}

export interface SeriesCreateRequest {
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
}

export interface SeriesUpdateRequest {
  title?: string;
  slug?: string;
  description?: string;
  thumbnail?: string;
}
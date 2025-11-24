export interface PostListItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  createdAt: string;
  author: PostAuthor;
  status?: string;
}

export interface PostAuthor {
  id: string;
  displayName: string;
  avatarUrl?: string;
}

export interface PostDetail {
  id: string;
  title: string;
  slug: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: PostAuthor;
  series?: SeriesSummary;
  orderInSeries?: number;
  status: string;
}

export interface SeriesSummary {
  id: string;
  title: string;
  slug: string;
}

export interface PostCreateRequest {
  title: string;
  slug: string;
  content: string;
  seriesId?: string;
  orderInSeries?: number;
}

export interface PostUpdateRequest {
  title?: string;
  slug?: string;
  content?: string;
  seriesId?: string;
  orderInSeries?: number;
}

export interface SeriesListItem {
  id: string;
  title: string;
  slug: string;
}

export interface SeriesDetail {
  id: string;
  title: string;
  slug: string;
  description?: string;
  thumbnail?: string;
  posts: PostInSeries[];
}

export interface PostInSeries {
  id: string;
  title: string;
  slug: string;
  orderInSeries: number;
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
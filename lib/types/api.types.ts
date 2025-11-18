export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  timestamp: string;
  path?: string;
  traceId?: string;
}


export interface ErrorResponse {
  code: string;
  message: string;
  details?: ErrorDetail[];
  timestamp?: string;
  path?: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
  rejectedValue?: any;
}


export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}


export interface PaginationParams {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}
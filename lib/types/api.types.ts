/**
 * Base API Response từ BE
 */
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  timestamp: string;
  path?: string;
  traceId?: string;
}

/**
 * Error Response từ BE khi có lỗi
 */
export interface ErrorResponse {
  code: string;
  message: string;
  details?: ErrorDetail[];
  timestamp: string;
  path?: string;
  traceId?: string;
}

export interface ErrorDetail {
  field: string;
  message: string;
  rejectedValue?: unknown;
}

/**
 * API Error Response - khi success = false
 */
export interface ApiErrorResponse {
  success: false;
  data: ErrorResponse;
  timestamp: string;
  path?: string;
  traceId?: string;
}
import { AxiosError } from 'axios';
import type { ApiErrorResponse, ErrorResponse } from '../types/api.types';

/**
 * Check xem response có phải là error response không
 */
export function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    'success' in data &&
    data.success === false &&
    'data' in data
  );
}

/**
 * Extract error message từ axios error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    // Trường hợp BE trả về ApiResponse với ErrorResponse
    if (isApiErrorResponse(data)) {
      return data.data.message;
    }

    // Trường hợp BE trả về message trực tiếp
    if (typeof data === 'object' && data !== null && 'message' in data) {
      return String(data.message);
    }

    // Fallback to axios error message
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred';
}

/**
 * Extract error code từ axios error
 */
export function getErrorCode(error: unknown): string | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (isApiErrorResponse(data)) {
      return data.data.code;
    }

    if (typeof data === 'object' && data !== null && 'code' in data) {
      return String(data.code);
    }
  }

  return null;
}

/**
 * Extract error details (cho validation errors)
 */
export function getErrorDetails(error: unknown): ErrorResponse['details'] | null {
  if (error instanceof AxiosError) {
    const data = error.response?.data;

    if (isApiErrorResponse(data)) {
      return data.data.details || null;
    }
  }

  return null;
}

/**
 * Format validation errors thành user-friendly message
 */
export function formatValidationErrors(error: unknown): string {
  const details = getErrorDetails(error);

  if (!details || details.length === 0) {
    return getErrorMessage(error);
  }

  // Lấy message đầu tiên
  return details[0].message;
}
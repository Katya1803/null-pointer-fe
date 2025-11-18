import { AxiosError } from 'axios';
import type { ApiResponse, ErrorResponse } from '@/lib/types/api.types';

/**
 * Extract error message from API response
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof AxiosError) {
    const apiResponse = error.response?.data as ApiResponse<ErrorResponse>;
    
    // Check if it's our standard error response
    if (apiResponse?.data?.message) {
      return apiResponse.data.message;
    }
    
    // Check for message in the response
    if (apiResponse?.message) {
      return apiResponse.message;
    }
    
    // Check for validation errors
    if (apiResponse?.data?.details && apiResponse.data.details.length > 0) {
      return apiResponse.data.details
        .map(detail => `${detail.field}: ${detail.message}`)
        .join(', ');
    }
    
    // Default error messages
    if (error.response?.status === 401) {
      return 'Unauthorized. Please login again.';
    }
    
    if (error.response?.status === 403) {
      return 'You do not have permission to access this resource.';
    }
    
    if (error.response?.status === 404) {
      return 'Resource not found.';
    }
    
    if (error.response?.status === 500) {
      return 'Internal server error. Please try again later.';
    }
    
    return error.message || 'An unexpected error occurred';
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return 'An unexpected error occurred';
}

/**
 * Check if error is authentication related
 */
export function isAuthError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    return error.response?.status === 401;
  }
  return false;
}

/**
 * Check if error is validation related
 */
export function isValidationError(error: unknown): boolean {
  if (error instanceof AxiosError) {
    const apiResponse = error.response?.data as ApiResponse<ErrorResponse>;
    return !!apiResponse?.data?.details && apiResponse.data.details.length > 0;
  }
  return false;
}
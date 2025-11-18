import apiClient from './client';
import type { ApiResponse, PageResponse, PaginationParams } from '@/lib/types/api.types';
import type { UserResponse, UpdateUserRequest } from '@/lib/types/user.types';
import { API_ROUTES } from '@/lib/constants';

/**
 * User Service - Handles all user-related API calls
 */
export const userService = {
  /**
   * Get current user profile
   */
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    const response = await apiClient.get<ApiResponse<UserResponse>>(
      API_ROUTES.USER.ME
    );
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserResponse>> {
    const response = await apiClient.get<ApiResponse<UserResponse>>(
      API_ROUTES.USER.BY_ID(userId)
    );
    return response.data;
  },

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<ApiResponse<UserResponse>> {
    const response = await apiClient.get<ApiResponse<UserResponse>>(
      API_ROUTES.USER.BY_USERNAME(username)
    );
    return response.data;
  },

  /**
   * Get all users (paginated) - Admin only
   */
  async getAllUsers(params?: PaginationParams): Promise<ApiResponse<PageResponse<UserResponse>>> {
    const response = await apiClient.get<ApiResponse<PageResponse<UserResponse>>>(
      API_ROUTES.USER.ALL,
      {
        params: {
          page: params?.page ?? 0,
          size: params?.size ?? 20,
          sortBy: params?.sortBy ?? 'createdAt',
          sortDirection: params?.sortDirection ?? 'DESC',
        },
      }
    );
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(
    userId: string,
    data: UpdateUserRequest
  ): Promise<ApiResponse<UserResponse>> {
    const response = await apiClient.put<ApiResponse<UserResponse>>(
      API_ROUTES.USER.UPDATE(userId),
      data
    );
    return response.data;
  },

  /**
   * Delete user (soft delete) - Admin only
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await apiClient.delete<ApiResponse<void>>(
      API_ROUTES.USER.DELETE(userId)
    );
    return response.data;
  },
};
import { api } from '../api';
import type { ApiResponse } from '../types/api.types';
import type {
  UserResponse,
  UserProfileResponse,
  UpdateUserRequest,
  UpdateUserProfileRequest,
  PageResponse,
} from '../types/user.types';

export const userService = {
  /**
   * Get current user info
   */
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    const response = await api.get('/users/me');
    return response.data;
  },

  /**
   * Get user by ID
   */
  async getUserById(userId: string): Promise<ApiResponse<UserResponse>> {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get user by username
   */
  async getUserByUsername(username: string): Promise<ApiResponse<UserResponse>> {
    const response = await api.get(`/users/username/${username}`);
    return response.data;
  },

  /**
   * Update user
   */
  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    const response = await api.put(`/users/${userId}`, data);
    return response.data;
  },

  /**
   * Delete user
   */
  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  /**
   * Get all users (admin only)
   */
  async getAllUsers(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<ApiResponse<PageResponse<UserResponse>>> {
    const response = await api.get('/users', { params });
    return response.data;
  },
};

export const userProfileService = {
  /**
   * Get profile by user ID
   */
  async getProfile(userId: string): Promise<ApiResponse<UserProfileResponse>> {
    const response = await api.get(`/users/${userId}/profile`);
    return response.data;
  },

  /**
   * Get current user profile
   */
  async getMyProfile(): Promise<ApiResponse<UserProfileResponse>> {
    const response = await api.get('/users/profile/me');
    return response.data;
  },

  /**
   * Update profile
   */
  async updateProfile(
    userId: string,
    data: UpdateUserProfileRequest
  ): Promise<ApiResponse<UserProfileResponse>> {
    const response = await api.put(`/users/${userId}/profile`, data);
    return response.data;
  },
};
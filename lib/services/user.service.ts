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
  async getCurrentUser(): Promise<ApiResponse<UserResponse>> {
    const response = await api.get('/api/users/me');
    return response.data;
  },

  async getUserById(userId: string): Promise<ApiResponse<UserResponse>> {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  },

  async getUserByUsername(username: string): Promise<ApiResponse<UserResponse>> {
    const response = await api.get(`/api/users/username/${username}`);
    return response.data;
  },

  async updateUser(userId: string, data: UpdateUserRequest): Promise<ApiResponse<UserResponse>> {
    const response = await api.put(`/api/users/${userId}`, data);
    return response.data;
  },

  async deleteUser(userId: string): Promise<ApiResponse<void>> {
    const response = await api.delete(`/api/users/${userId}`);
    return response.data;
  },

  async getAllUsers(params: {
    page?: number;
    size?: number;
    sortBy?: string;
    sortDirection?: 'ASC' | 'DESC';
  }): Promise<ApiResponse<PageResponse<UserResponse>>> {
    const response = await api.get('/api/users', { params });
    return response.data;
  },
};

export const userProfileService = {
  async getMyProfile(): Promise<ApiResponse<UserProfileResponse>> {
    const user = await userService.getCurrentUser();
    const response = await api.get(`/api/users/${user.data.id}/profile/me`);
    return response.data;
  },

  async getProfile(userId: string): Promise<ApiResponse<UserProfileResponse>> {
    const response = await api.get(`/api/users/${userId}/profile`);
    return response.data;
  },

  async updateProfile(
    userId: string,
    data: UpdateUserProfileRequest
  ): Promise<ApiResponse<UserProfileResponse>> {
    const response = await api.put(`/api/users/${userId}/profile`, data);
    return response.data;
  },
};
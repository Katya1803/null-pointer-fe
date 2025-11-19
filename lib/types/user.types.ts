/**
 * User Request Types
 */
export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface UpdateUserProfileRequest {
  fullName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
}

/**
 * User Response Types
 */
export interface UserResponse {
  id: string;
  accountId: string;
  username: string;
  email: string;
  roles: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfileResponse {
  id: string;
  userId: string;
  fullName?: string;
  bio?: string;
  avatar?: string;
  phoneNumber?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Pagination Response
 */
export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  first: boolean;
}
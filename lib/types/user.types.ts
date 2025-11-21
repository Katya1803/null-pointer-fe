export interface UpdateUserRequest {
  username?: string;
  email?: string;
}

export interface UpdateUserProfileRequest {
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
}

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
  firstName?: string;
  lastName?: string;
  bio?: string;
  avatarUrl?: string;
  phone?: string;
}


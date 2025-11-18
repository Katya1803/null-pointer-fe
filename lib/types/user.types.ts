/**
 * User Response
 * Matches: com.app.common.dto.common.UserResponse
 */
export interface UserResponse {
  id: string;
  accountId: string;
  username: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * User Status Enum
 * Matches: com.app.user.constant.UserStatus
 */
export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  DELETED = 'DELETED',
}

/**
 * Create User Request (internal - service to service)
 * Matches: com.app.common.dto.common.CreateUserRequest
 */
export interface CreateUserRequest {
  accountId: string;
  username: string;
  email: string;
}

/**
 * Update User Request
 * Matches: com.app.user.dto.UpdateUserRequest
 */
export interface UpdateUserRequest {
  email?: string;
  status?: UserStatus;
}
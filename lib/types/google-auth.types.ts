export interface GoogleLoginRequest {
  code: string;
  deviceId?: string;
}

export interface GoogleLoginResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
  user: {
    id: string;
    username: string;
    email: string;
    roles: string;
  };
}
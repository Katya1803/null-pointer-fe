import { api } from "@/lib/api";
import type { 
  GoogleLoginRequest, 
  GoogleLoginResponse 
} from "@/lib/types/google-auth.types";
import type { ApiResponse } from "@/lib/types/api.types";

const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
  "218819989351-vd0qstuj4v33n7oauto62bloq38cp07k.apps.googleusercontent.com";

const GOOGLE_REDIRECT_URI = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI || 
  "http://localhost:3000/auth/google-callback";

class GoogleAuthService {
  /**
   * Get Google OAuth URL for user to authorize
   */
  getGoogleAuthUrl(): string {
    const params = new URLSearchParams({
      client_id: GOOGLE_CLIENT_ID,
      redirect_uri: GOOGLE_REDIRECT_URI,
      response_type: "code",
      scope: "openid email profile",
      access_type: "offline",
      prompt: "consent",
    });

    return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  }

  /**
   * Handle Google OAuth callback with authorization code
   */
  async handleGoogleCallback(
    code: string,
    deviceId?: string
  ): Promise<ApiResponse<GoogleLoginResponse>> {
    const request: GoogleLoginRequest = {
      code,
      deviceId,
    };

    const response = await api.post<ApiResponse<GoogleLoginResponse>>(
      "/auth/google/callback",
      request
    );

    return response.data;
  }
}

export const googleAuthService = new GoogleAuthService();
"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpSchema, type VerifyOtpFormData } from "@/lib/validations/auth.validations";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/store/auth-store";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  
  // ✅ FIX: Use setAuth instead of separate setaccess_token and setUser
  const { setAuth } = useAuthStore();

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendMessage, setResendMessage] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: {
      email,
      deviceId: "web",
    },
  });

  // Update email when URL param changes
  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      setIsLoading(true);
      setError("");
      setResendMessage("");

      const response = await authService.verifyOtp(data);

      // ✅ FIX: Use setAuth to update both token and user
      setAuth(response.data.access_token, response.data.user);

      console.log("✅ Email verified successfully");
      
      // Redirect to home
      router.push("/");
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.data?.message || 
        err.response?.data?.message || 
        "Invalid OTP. Please try again.";
      setError(errorMessage);
      console.error("❌ OTP verification failed:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      setError("Email is required to resend OTP");
      return;
    }

    try {
      setIsResending(true);
      setResendMessage("");
      setError("");

      await authService.resendOtp({ email });
      
      setResendMessage("✅ OTP sent successfully! Please check your email.");
      console.log("✅ OTP resent to:", email);
    } catch (err: any) {
      const errorMessage = 
        err.response?.data?.data?.message || 
        err.response?.data?.message || 
        "Failed to resend OTP. Please try again.";
      setError(errorMessage);
      console.error("❌ Resend OTP failed:", errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">
            Verify Email
          </h1>
          <p className="text-dark-muted">
            We sent a 6-digit code to
          </p>
          <p className="text-dark-text font-medium mt-1">
            {email || "your email"}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-500 text-sm">{error}</p>
          </div>
        )}

        {/* Success Message */}
        {resendMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg">
            <p className="text-green-500 text-sm">{resendMessage}</p>
          </div>
        )}

        {/* OTP Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Verification Code
            </label>
            <input
              {...register("otp")}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              autoComplete="one-time-code"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-center text-2xl tracking-[0.5em] placeholder:text-dark-muted focus:outline-none focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20"
              placeholder="000000"
              autoFocus
            />
            {errors.otp && (
              <p className="mt-2 text-sm text-red-500">{errors.otp.message}</p>
            )}
            <p className="mt-2 text-xs text-dark-muted text-center">
              Code expires in 5 minutes
            </p>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                    fill="none"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Verifying...
              </span>
            ) : (
              "Verify Email"
            )}
          </button>
        </form>

        {/* Resend OTP */}
        <div className="mt-6 text-center">
          <p className="text-dark-muted text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-primary-500 hover:underline disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>

        {/* Back to Login */}
        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/login")}
            className="text-dark-muted text-sm hover:text-primary-500 transition-colors"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense 
      fallback={
        <div className="flex h-screen items-center justify-center">
          <div className="text-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
            <p className="text-dark-muted">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyOtpContent />
    </Suspense>
  );
}
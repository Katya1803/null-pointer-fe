"use client";

import { useState, useEffect, Suspense } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { verifyOtpSchema, type VerifyOtpFormData } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/store/auth-store";

function VerifyOtpContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { setAccessToken, setUser } = useAuthStore();

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

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  const onSubmit = async (data: VerifyOtpFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authService.verifyOtp(data);

      setAccessToken(response.data.accessToken);
      setUser(response.data.user);

      router.push("/");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Invalid OTP. Please try again.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      setResendMessage("");
      setError("");

      await authService.resendOtp({ email });
      setResendMessage("OTP sent successfully. Please check your email.");
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Failed to resend OTP.";
      setError(errorMessage);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">Verify Email</h1>
          <p className="text-dark-muted">
            We sent a 6-digit code to <br />
            <span className="text-dark-text font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {resendMessage && (
          <div className="mb-6 p-4 bg-primary-500/10 border border-primary-500 rounded-lg text-primary-500 text-sm">
            {resendMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Verification Code
            </label>
            <input
              {...register("otp")}
              type="text"
              maxLength={6}
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text text-center text-2xl tracking-widest placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="000000"
            />
            {errors.otp && (
              <p className="mt-1 text-sm text-red-500">{errors.otp.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-dark-muted text-sm">
            Didn't receive the code?{" "}
            <button
              onClick={handleResendOtp}
              disabled={isResending}
              className="text-primary-500 hover:underline disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
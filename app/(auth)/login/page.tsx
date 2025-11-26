// app/(auth)/login/page.tsx - UPDATED VERSION
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.validations";
import { authService } from "@/lib/services/auth.service";
import { useAuthStore } from "@/lib/store/auth-store";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { GoogleLoginButton } from "@/components/auth/GoogleLoginButton";

export default function LoginPage() {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authService.login(data);
      setAuth(response.data.access_token, response.data.user);

      router.push("/");
    } catch (err: any) {
      const errorMessage = getErrorMessage(err);
      
      if (errorMessage.includes("EMAIL_NOT_VERIFIED:")) {
        const email = errorMessage.split("EMAIL_NOT_VERIFIED:")[1];
        router.push(`/verify-otp?email=${encodeURIComponent(email)}`);
        return;
      }
      
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary-500 mb-2">NullPointer</h1>
          <p className="text-dark-muted">Sign in to your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Google Login Button */}
        <GoogleLoginButton className="mb-6" />

        {/* Divider */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-dark-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-card text-dark-muted">Or continue with</span>
          </div>
        </div>

        {/* Email/Password Login Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Username or Email
            </label>
            <input
              {...register("account")}
              type="text"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="Enter username or email"
            />
            {errors.account && (
              <p className="mt-1 text-sm text-red-500">{errors.account.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Password
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="Enter your password"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary-500 hover:bg-primary-600 text-white font-medium py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm">
          <span className="text-dark-muted">Don&apos;t have an account? </span>
          <Link href="/signup" className="text-primary-500 hover:text-primary-400 font-medium">
            Sign up
          </Link>
        </div>
      </div>
    </div>
  );
}
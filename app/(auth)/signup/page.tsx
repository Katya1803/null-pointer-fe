"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { registerSchema, type RegisterFormData } from "@/lib/validations/auth";
import { authService } from "@/lib/services/auth.service";

export default function SignupPage() {
  const router = useRouter();
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError("");

      const response = await authService.register(data);

      router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || "Registration failed. Please try again.";
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
          <p className="text-dark-muted">Create your account</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Username *
            </label>
            <input
              {...register("username")}
              type="text"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="Enter username"
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Email *
            </label>
            <input
              {...register("email")}
              type="email"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="Enter email"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-dark-text mb-2">
              Password *
            </label>
            <input
              {...register("password")}
              type="password"
              className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
              placeholder="Enter password (min 8 characters)"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                First Name
              </label>
              <input
                {...register("firstName")}
                type="text"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
                placeholder="First name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-text mb-2">
                Last Name
              </label>
              <input
                {...register("lastName")}
                type="text"
                className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text placeholder:text-dark-muted focus:outline-none focus:border-primary-500"
                placeholder="Last name"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-dark-muted text-sm">
            Already have an account?{" "}
            <Link href="/login" className="text-primary-500 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
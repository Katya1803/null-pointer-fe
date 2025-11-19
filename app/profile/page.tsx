"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { userProfileService } from "@/lib/services/user.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import type { UserProfileResponse } from "@/lib/types/user.types";

const profileSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  bio: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
  });

  // Load profile
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await userProfileService.getMyProfile();
        setProfile(response.data);
        reset({
          fullName: response.data.fullName || "",
          bio: response.data.bio || "",
          phoneNumber: response.data.phoneNumber || "",
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [reset]);

  // Update profile
  const onSubmit = async (data: ProfileFormData) => {
    if (!profile) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await userProfileService.updateProfile(profile.userId, data);
      setProfile(response.data);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-dark-text">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold text-dark-text mb-8">My Profile</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Full Name</label>
          <input
            {...register("fullName")}
            type="text"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
            disabled={isSaving}
          />
          {errors.fullName && (
            <p className="mt-1 text-sm text-red-500">{errors.fullName.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Bio</label>
          <textarea
            {...register("bio")}
            rows={4}
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
            disabled={isSaving}
          />
          {errors.bio && <p className="mt-1 text-sm text-red-500">{errors.bio.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-dark-text mb-2">Phone Number</label>
          <input
            {...register("phoneNumber")}
            type="tel"
            className="w-full px-4 py-3 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
            disabled={isSaving}
          />
          {errors.phoneNumber && (
            <p className="mt-1 text-sm text-red-500">{errors.phoneNumber.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="w-full py-3 bg-primary-500 text-white rounded-lg font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSaving ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}
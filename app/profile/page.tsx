"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth-store";
import { userService, userProfileService } from "@/lib/services/user.service";
import { getErrorMessage } from "@/lib/utils/error.utils";
import { Avatar } from "@/components/ui/Avatar";
import { ProfileBlogsTab } from "@/components/profile/ProfileBlogsTab";
import type { UserResponse, UserProfileResponse } from "@/lib/types/user.types";

type TabType = 'profile' | 'blogs' | 'community';

export default function UserManagementPage() {
  const router = useRouter();
  const { user: authUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState<TabType>('profile');
  const [user, setUser] = useState<UserResponse | null>(null);
  const [profile, setProfile] = useState<UserProfileResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    bio: "",
  });

  useEffect(() => {
    if (!authUser) {
      router.push("/login");
      return;
    }

    const loadData = async () => {
      try {
        const [userData, profileData] = await Promise.all([
          userService.getCurrentUser(),
          userProfileService.getMyProfile(),
        ]);

        setUser(userData.data);
        setProfile(profileData.data);
        setFormData({
          firstName: profileData.data.firstName || "",
          lastName: profileData.data.lastName || "",
          phone: profileData.data.phone || "",
          bio: profileData.data.bio || "",
        });
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [authUser, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;

    try {
      setIsSaving(true);
      setError("");
      setSuccess("");

      const response = await userProfileService.updateProfile(user.id, formData);
      setProfile(response.data);
      setSuccess("Profile updated successfully!");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSaving(false);
    }
  };

  const getUsername = () => {
    if (formData.firstName || formData.lastName) {
      return `${formData.firstName} ${formData.lastName}`.trim();
    }
    return user?.username || "User";
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary-500 border-t-transparent mx-auto mb-4" />
          <p className="text-dark-muted">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <div className="bg-dark-card border border-dark-border rounded-lg p-4">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-text hover:bg-dark-bg'
                  }`}
              >
                Profile
              </button>
              <button
                onClick={() => setActiveTab('blogs')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors mt-2 ${activeTab === 'blogs'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-text hover:bg-dark-bg'
                  }`}
              >
                Blogs
              </button>
              <button
                onClick={() => setActiveTab('community')}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors mt-2 ${activeTab === 'community'
                    ? 'bg-primary-500 text-white'
                    : 'text-dark-text hover:bg-dark-bg'
                  }`}
              >
                Community
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className="bg-dark-card border border-dark-border rounded-lg p-6">
              {activeTab === 'profile' && (
                <div>
                  <h1 className="text-2xl font-bold text-white mb-6">Profile Settings</h1>

                  {error && (
                    <div className="mb-4 p-4 bg-red-500/10 border border-red-500 rounded-lg text-red-500">
                      {error}
                    </div>
                  )}

                  {success && (
                    <div className="mb-4 p-4 bg-green-500/10 border border-green-500 rounded-lg text-green-500">
                      {success}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex items-center gap-4">
                      <Avatar
                        avatarUrl={profile?.avatarUrl}
                        username={getUsername()}
                        size="xl"
                      />
                      <div>
                        <h3 className="text-lg font-semibold text-white">{getUsername()}</h3>
                        <p className="text-sm text-dark-muted">@{user.username}</p>
                      </div>
                    </div>

                    {/* Email (Read-only) */}
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={user.email}
                        disabled
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-muted cursor-not-allowed"
                      />
                      <p className="mt-1 text-xs text-dark-muted">Email cannot be changed</p>
                    </div>

                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                        placeholder="Enter your first name"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                        placeholder="Enter your last name"
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500"
                        placeholder="Enter your phone number"
                      />
                    </div>

                    {/* Bio */}
                    <div>
                      <label className="block text-sm font-medium text-dark-text mb-2">
                        Bio
                      </label>
                      <textarea
                        value={formData.bio}
                        onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-dark-text focus:outline-none focus:border-primary-500 resize-none"
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    {/* Submit Button */}
                    <div>
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSaving ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'blogs' && <ProfileBlogsTab />}

              {activeTab === 'community' && (
                <div className="text-center py-12">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-500/10 mb-4">
                    <span className="text-3xl">👥</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">Community Coming Soon</h2>
                  <p className="text-dark-muted">This feature is under development</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
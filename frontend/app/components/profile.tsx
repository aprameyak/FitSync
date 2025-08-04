import { useState, useEffect } from "react";
import { profileApi } from "../routes/profile";
import { Profile } from "../types";

interface ProfileSectionProps {
  userId: string;
}

export const ProfileSection = ({ userId }: ProfileSectionProps) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const data = await profileApi.fetchProfile(userId);
      setProfile(data);
      setEditedProfile(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const updatedProfile = await profileApi.updateProfile(editedProfile, userId);
      setProfile(updatedProfile);
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message || "Failed to update profile");
    }
  };

  const calculateBMR = (profile: Profile | null) => {
    if (!profile) return 0;
    const { weight, height, age, gender } = profile;
    if (gender === "male") {
      return 10 * weight + 6.25 * height - 5 * age + 5;
    }
    return 10 * weight + 6.25 * height - 5 * age - 161;
  };

  const calculateTDEE = (profile: Profile | null) => {
    if (!profile) return 0;
    const bmr = calculateBMR(profile);
    const activityMultipliers: Record<string, number> = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };
    return bmr * (activityMultipliers[profile.activityLevel] || 1.2);
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md">
        <p className="text-gray-600">
          No profile information available. Please create your profile.
        </p>
        <button
          onClick={() => setIsEditing(true)}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create Profile
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Profile Information</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {isEditing ? "Cancel" : "Edit"}
        </button>
      </div>

      {isEditing ? (
        <form className="flex flex-col gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              value={editedProfile.weight || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, weight: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              value={editedProfile.height || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, height: parseFloat(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age
            </label>
            <input
              id="age"
              type="number"
              value={editedProfile.age || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, age: parseInt(e.target.value) })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
              Gender
            </label>
            <select
              id="gender"
              value={editedProfile.gender || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, gender: e.target.value as "male" | "female" | "other" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="activityLevel" className="block text-sm font-medium text-gray-700 mb-1">
              Activity Level
            </label>
            <select
              id="activityLevel"
              value={editedProfile.activityLevel || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, activityLevel: e.target.value as "sedentary" | "light" | "moderate" | "active" | "very_active" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select activity level</option>
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-gray-700 mb-1">
              Goal
            </label>
            <select
              id="goal"
              value={editedProfile.goal || ""}
              onChange={(e) => setEditedProfile({ ...editedProfile, goal: e.target.value as "lose_weight" | "maintain" | "gain_weight" })}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select goal</option>
              <option value="lose_weight">Lose Weight</option>
              <option value="maintain">Maintain Weight</option>
              <option value="gain_weight">Gain Weight</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Save Changes
          </button>
        </form>
      ) : (
        <div className="space-y-4">
          <p className="text-gray-700">Weight: {profile.weight ?? "--"} kg</p>
          <p className="text-gray-700">Height: {profile.height ?? "--"} cm</p>
          <p className="text-gray-700">Age: {profile.age ?? "--"}</p>
          <p className="text-gray-700">Gender: {profile.gender ?? "--"}</p>
          <p className="text-gray-700">Activity Level: {profile.activityLevel ?? "--"}</p>
          <p className="text-gray-700">Goal: {profile.goal ?? "--"}</p>

          <div className="mt-4 pt-4 border-t">
            <p className="text-gray-700">BMR: {calculateBMR(profile)} kcal</p>
            <p className="text-gray-700">TDEE: {calculateTDEE(profile)} kcal</p>
          </div>
        </div>
      )}
    </div>
  );
};

"use client";
import { useState, useEffect } from "react";
import { ProfileSection } from "./components/profile";
import { WorkoutSection } from "./components/workout";
import { NutritionSection } from "./components/nutrition";
import { ChatSection } from "./components/chat";
import { profileApi } from "./routes/profile";
import { workoutApi } from "./routes/workouts";
import { nutritionApi } from "./routes/nutrition";
import { chatApi } from "./routes/chat";
import { Profile, Workout, NutritionEntry, ChatMessage } from "./types";
import { useAuth } from './context/AuthContext';

function Home() {
  const { user, loading } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" }
  ]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (!loading && user) {
      fetchUserData();
    } else if (!loading && !user) {
      setIsLoading(false);
    }
  }, [loading, user]);

  const fetchUserData = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, workoutsData, nutritionData] = await Promise.all([
        profileApi.fetchProfile(user.id),
        workoutApi.fetchWorkouts(user.id),
        nutritionApi.fetchNutrition(user.id)
      ]);
      setProfile(profileData);
      setWorkouts(workoutsData);
      setNutritionEntries(nutritionData);
    } catch (error: any) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    }
    setIsLoading(false);
  };

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !user) return;
    setMessages((prev) => [...prev, { role: "user", content: message }]);
    setInputMessage("");
    try {
      const response = await chatApi.sendMessage(message, messages);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error: any) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      ]);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="h-screen flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center">
        <h2 className="text-xl text-gray-600 mb-4">
          Welcome to FitSync! Please sign in to continue.
        </h2>
        <a
          href="/sign-in"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Sign In
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">
          FitSync
        </h1>
      </div>
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="col-span-1">
          <ProfileSection userId={user.id} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <WorkoutSection userId={user.id} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <NutritionSection userId={user.id} />
        </div>
        <div className="col-span-1 md:col-span-2">
          <ChatSection
            messages={messages}
            inputMessage={inputMessage}
            onInputChange={setInputMessage}
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return <Home />;
}

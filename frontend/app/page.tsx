"use client";
import { ClerkProvider, SignedIn, SignedOut, useUser, SignIn } from "@clerk/nextjs";
import { Box, CircularProgress, Button, Typography, Grid, Alert } from "@mui/material";
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

function Home() {
  const { user, isLoaded } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you with your fitness journey today?" },
  ]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [inputMessage, setInputMessage] = useState("");

  useEffect(() => {
    if (isLoaded && user) {
      fetchUserData();
    } else if (isLoaded && !user) {
      setIsLoading(false);
    }
  }, [isLoaded, user]);

  const fetchUserData = async () => {
    if (!user) return;
    setIsLoading(true);
    setError(null);
    try {
      const [profileData, workoutsData, nutritionData] = await Promise.all([
        profileApi.fetchProfile(user.id),
        workoutApi.fetchWorkouts(user.id),
        nutritionApi.fetchNutrition(user.id),
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
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f7fafc" }}>
      <SignedOut>
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <Typography variant="h5" color="textSecondary" gutterBottom>
            Welcome to FitSync! Please sign in to continue.
          </Typography>
          <Box width="100%" maxWidth="400px">
            <SignIn routing="path" path="/" />
          </Box>
        </Box>
      </SignedOut>

      <SignedIn>
        {!isLoaded || isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
              <Typography variant="h4" color="primary">
                FitSync
              </Typography>
            </Box>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <Grid container spacing={4}>
              <Grid item xs={12}>
                <ProfileSection userId={user?.id || ""} />
              </Grid>

              <Grid item xs={12} md={6}>
                <WorkoutSection 
                  userId={user?.id || ""} 
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <NutritionSection
                  userId={user?.id || ""}
                />
              </Grid>

              <Grid item xs={12}>
                <ChatSection
                  messages={messages}
                  inputMessage={inputMessage}
                  onInputChange={setInputMessage}
                  onSendMessage={handleSendMessage}
                  isLoading={isLoading}
                />
              </Grid>
            </Grid>
          </>
        )}
      </SignedIn>
    </Box>
  );
}

export default function App() {
  return (
    <ClerkProvider>
      <Home />
    </ClerkProvider>
  );
}

"use client";
import { useUser } from "@clerk/nextjs";
import { Box, CircularProgress, Button, Typography, Grid, Paper, Alert, TextField } from "@mui/material";
import { useState, useEffect } from "react";
import { Modal } from "./components/modal";
import { ProfileSection } from "./components/profile";
import { WorkoutSection } from "./components/workout";
import { NutritionSection } from "./components/nutrition";
import { ChatSection } from "./components/chat";
import { profileApi } from "./apis/profile";
import { workoutApi } from "./apis/workouts"; 
import { nutritionApi } from "./apis/nutrition";
import { chatApi } from "./apis/chat";
import { Profile, Workout, NutritionEntry, ChatMessage } from "./types";

export default function Home() {
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
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isMealModalOpen, setIsMealModalOpen] = useState(false);
  const [newWorkout, setNewWorkout] = useState<Workout>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0
  });
  const [newMeal, setNewMeal] = useState<NutritionEntry>({
    food: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  });

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

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
    } catch (error) {
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
      const response = await chatApi.sendMessage(message, user.id);
      setMessages((prev) => [...prev, { role: "assistant", content: response }]);
    } catch (error) {
      console.error("Error sending message:", error);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." },
      ]);
    }
  };

  const handleAddWorkout = async () => {
    if (!user) return;
    try {
      await workoutApi.addWorkout(newWorkout, user.id);
      await fetchUserData();
      setIsWorkoutModalOpen(false);
      setNewWorkout({ name: '', sets: 0, reps: 0, weight: 0 });
    } catch (error) {
      console.error("Error adding workout:", error);
      setError("Failed to add workout. Please try again.");
    }
  };

  const handleAddMeal = async () => {
    if (!user) return;
    try {
      await nutritionApi.addNutrition(newMeal, user.id);
      await fetchUserData();
      setIsMealModalOpen(false);
      setNewMeal({ food: '', calories: 0, protein: 0, carbs: 0, fat: 0 });
    } catch (error) {
      console.error("Error adding meal:", error);
      setError("Failed to add meal. Please try again.");
    }
  };

  return (
    <Box sx={{ padding: 4, minHeight: "100vh", backgroundColor: "#f7fafc" }}>
      {!isLoaded ? (
        <CircularProgress />
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

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <ProfileSection profile={profile} />
              </Grid>

              <Grid item xs={12} md={6}>
                <WorkoutSection 
                  workouts={workouts} 
                  onAddWorkout={() => setIsWorkoutModalOpen(true)} 
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <NutritionSection 
                  nutritionEntries={nutritionEntries} 
                  onAddMeal={() => setIsMealModalOpen(true)} 
                />
              </Grid>

              <Grid item xs={12}>
                <ChatSection 
                  messages={messages}
                  inputMessage={inputMessage}
                  onInputChange={setInputMessage}
                  onSendMessage={handleSendMessage}
                />
              </Grid>
            </Grid>
          )}

          {/* Workout Modal */}
          <Modal
            isOpen={isWorkoutModalOpen}
            onClose={() => setIsWorkoutModalOpen(false)}
            title="Add New Workout"
          >
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Exercise Name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({ ...newWorkout, name: e.target.value })}
                fullWidth
              />
              <TextField
                label="Sets"
                type="number"
                value={newWorkout.sets}
                onChange={(e) => setNewWorkout({ ...newWorkout, sets: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Reps"
                type="number"
                value={newWorkout.reps}
                onChange={(e) => setNewWorkout({ ...newWorkout, reps: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Weight (kg)"
                type="number"
                value={newWorkout.weight}
                onChange={(e) => setNewWorkout({ ...newWorkout, weight: Number(e.target.value) })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddWorkout}
              >
                Save Workout
              </Button>
            </Box>
          </Modal>

          {/* Meal Modal */}
          <Modal
            isOpen={isMealModalOpen}
            onClose={() => setIsMealModalOpen(false)}
            title="Add New Meal"
          >
            <Box component="form" sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="Food Name"
                value={newMeal.food}
                onChange={(e) => setNewMeal({ ...newMeal, food: e.target.value })}
                fullWidth
              />
              <TextField
                label="Calories"
                type="number"
                value={newMeal.calories}
                onChange={(e) => setNewMeal({ ...newMeal, calories: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Protein (g)"
                type="number"
                value={newMeal.protein}
                onChange={(e) => setNewMeal({ ...newMeal, protein: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Carbs (g)"
                type="number"
                value={newMeal.carbs}
                onChange={(e) => setNewMeal({ ...newMeal, carbs: Number(e.target.value) })}
                fullWidth
              />
              <TextField
                label="Fat (g)"
                type="number"
                value={newMeal.fat}
                onChange={(e) => setNewMeal({ ...newMeal, fat: Number(e.target.value) })}
                fullWidth
              />
              <Button
                variant="contained"
                onClick={handleAddMeal}
              >
                Save Meal
              </Button>
            </Box>
          </Modal>
        </>
      )}
    </Box>
  );
}

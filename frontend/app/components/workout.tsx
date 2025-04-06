import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress, Alert } from "@mui/material";
import axios from "axios";

interface Workout {
  _id: string;
  userId: string;
  excercise: string;
  loadandreptitions: string;
  calories: number;
  createdAt: string;
}

interface WorkoutSectionProps {
  userId: string;
}

export const WorkoutSection = ({ userId }: WorkoutSectionProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/fitness/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setWorkouts(response.data);
        } else {
          setWorkouts([]); 
        }
      } catch (err: any) {
        if (err.response?.status === 404) {
          setWorkouts([]); 
        } else {
          setError("Failed to fetch workouts. Please try again.");
        }
      }
      setIsLoading(false);
    };

    fetchWorkouts();
  }, [userId]);

  const handleAddWorkout = async () => {
    const newWorkout = {
      userId,
      excercise: "New Exercise",
      loadandreptitions: "10x3",
      calories: 200,
    };

    try {
      const response = await axios.post("/api/fitness", newWorkout);
      setWorkouts((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Failed to add workout. Please try again.");
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    try {
      await axios.delete(`/api/fitness/${id}`);
      setWorkouts((prev) => prev.filter((workout) => workout._id !== id));
    } catch (err) {
      setError("Failed to delete workout. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100%">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 2 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Recent Workouts</Typography>
        <Button variant="contained" color="primary" onClick={handleAddWorkout}>
          Add Workout
        </Button>
      </Box>
      {workouts.length > 0 ? (
        workouts.map((workout) => (
          <Box key={workout._id} sx={{ mb: 2, p: 2, backgroundColor: "#f8fafc", borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {workout.excercise}
            </Typography>
            <Typography variant="body2">
              Load & Reps: {workout.loadandreptitions} | Calories Burned: {workout.calories}
            </Typography>
            <Button
              variant="outlined"
              color="secondary"
              onClick={() => handleDeleteWorkout(workout._id)}
              sx={{ mt: 1 }}
            >
              Delete
            </Button>
          </Box>
        ))
      ) : (
        <Typography variant="body1" color="text.secondary">
          No workouts recorded yet. Start adding your workouts!
        </Typography>
      )}
    </Paper>
  );
};
import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress, Alert, TextField, Grid } from "@mui/material";
import axios from "axios";

interface Workout {
  _id: string;
  userId: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  pr: boolean;
  date: string;
  notes?: string;
}

interface WorkoutSectionProps {
  userId: string;
}

export const WorkoutSection = ({ userId }: WorkoutSectionProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({ 
    exercise: "", 
    sets: 0, 
    reps: 0, 
    weight: 0,
    notes: "",
    date: new Date().toISOString().split('T')[0]
  });
  const [exerciseBests, setExerciseBests] = useState<Record<string, { weight: number; reps: number }>>({});

  useEffect(() => {
    const fetchWorkouts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/fitness/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setWorkouts(response.data);
          calculateExerciseBests(response.data);
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

  const calculateExerciseBests = (workoutData: Workout[]) => {
    const bests: Record<string, { weight: number; reps: number }> = {};
    workoutData.forEach(workout => {
      if (!bests[workout.exercise] || 
          workout.weight > bests[workout.exercise].weight ||
          (workout.weight === bests[workout.exercise].weight && workout.reps > bests[workout.exercise].reps)) {
        bests[workout.exercise] = { weight: workout.weight, reps: workout.reps };
      }
    });
    setExerciseBests(bests);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewWorkout((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddWorkout = async () => {
    if (!newWorkout.exercise || newWorkout.sets <= 0 || newWorkout.reps <= 0 || newWorkout.weight <= 0) {
      setError("All fields are required and must be positive numbers.");
      return;
    }

    const isPR = !exerciseBests[newWorkout.exercise] || 
                 newWorkout.weight > exerciseBests[newWorkout.exercise].weight ||
                 (newWorkout.weight === exerciseBests[newWorkout.exercise].weight && 
                  newWorkout.reps > exerciseBests[newWorkout.exercise].reps);

    try {
      const response = await axios.post("/api/fitness", { 
        ...newWorkout, 
        userId,
        pr: isPR,
        date: newWorkout.date
      });
      setWorkouts(prev => [...prev, response.data]);
      calculateExerciseBests([...workouts, response.data]);
      setNewWorkout({ 
        exercise: "", 
        sets: 0, 
        reps: 0, 
        weight: 0,
        notes: "",
        date: new Date().toISOString().split('T')[0]
      });
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
        <Typography variant="h6">Workout Tracker</Typography>
        <Box display="flex" gap={2}>
          <TextField
            label="Exercise"
            name="exercise"
            value={newWorkout.exercise}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Sets"
            name="sets"
            type="number"
            value={newWorkout.sets}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Reps"
            name="reps"
            type="number"
            value={newWorkout.reps}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={newWorkout.weight}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Date"
            name="date"
            type="date"
            value={newWorkout.date}
            onChange={handleInputChange}
            size="small"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="Notes"
            name="notes"
            value={newWorkout.notes}
            onChange={handleInputChange}
            size="small"
          />
          <Button variant="contained" color="primary" onClick={handleAddWorkout}>
            Add Workout
          </Button>
        </Box>
      </Box>

      <Box mb={2}>
        <Typography variant="subtitle2">Personal Bests:</Typography>
        <Grid container spacing={1}>
          {Object.entries(exerciseBests).map(([exercise, best]) => (
            <Grid item xs={12} sm={6} md={4} key={exercise}>
              <Typography variant="body2">
                {exercise}: {best.weight}kg × {best.reps} reps
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Box>

      {workouts.length > 0 ? (
        workouts.map((workout) => (
          <Box 
            key={workout._id} 
            sx={{ 
              mb: 2, 
              p: 2, 
              backgroundColor: workout.pr ? "#e3f2fd" : "#f8fafc", 
              borderRadius: 1,
              border: workout.pr ? "1px solid #2196f3" : "none"
            }}
          >
            <Typography variant="subtitle1" fontWeight="bold">
              {workout.exercise} {workout.pr && "🏆 PR!"}
            </Typography>
            <Typography variant="body2">
              Sets: {workout.sets} | Reps: {workout.reps} | Weight: {workout.weight} kg
            </Typography>
            {workout.notes && (
              <Typography variant="body2" color="text.secondary">
                Notes: {workout.notes}
              </Typography>
            )}
            <Typography variant="caption" color="text.secondary">
              {new Date(workout.date).toLocaleDateString()}
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
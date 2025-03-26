import { Box, Button, Typography, Paper } from "@mui/material";
import { Workout } from "../types";

interface WorkoutSectionProps {
  workouts: Workout[];
  onAddWorkout: () => void;
}

export const WorkoutSection = ({ workouts, onAddWorkout }: WorkoutSectionProps) => {
  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Recent Workouts</Typography>
        <Button variant="contained" color="primary" onClick={onAddWorkout}>
          Add Workout
        </Button>
      </Box>
      {workouts.length > 0 ? (
        workouts.map((workout, index) => (
          <Box key={index} sx={{ mb: 2, p: 2, backgroundColor: "#f8fafc", borderRadius: 1 }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {workout.name}
            </Typography>
            <Typography variant="body2">
              Sets: {workout.sets} | Reps: {workout.reps} | Weight: {workout.weight}kg
            </Typography>
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
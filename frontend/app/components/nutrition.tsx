import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress, Alert, Grid } from "@mui/material";
import axios from "axios";

interface NutritionEntry {
  _id: string;
  userId: string;
  food: string;
  quantity: string;
  calories: number;
  createdAt: string;
}

interface NutritionSectionProps {
  userId: string;
}

export const NutritionSection = ({ userId }: NutritionSectionProps) => {
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNutritionEntries = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/nutrition/${userId}`);
        if (response.data && Array.isArray(response.data)) {
          setNutritionEntries(response.data);
        } else {
          setNutritionEntries([]);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          setNutritionEntries([]);
        } else {
          setError("Failed to fetch nutrition entries. Please try again.");
        }
      }
      setIsLoading(false);
    };

    fetchNutritionEntries();
  }, [userId]);

  const handleAddMeal = async () => {
    const newMeal = {
      userId,
      food: "New Food",
      quantity: "1 serving",
      calories: 300,
    };

    try {
      const response = await axios.post("/api/nutrition", newMeal);
      setNutritionEntries((prev) => [...prev, response.data]);
    } catch (err) {
      setError("Failed to add meal. Please try again.");
    }
  };

  const handleDeleteMeal = async (id: string) => {
    try {
      await axios.delete(`/api/nutrition/${id}`);
      setNutritionEntries((prev) => prev.filter((entry) => entry._id !== id));
    } catch (err) {
      setError("Failed to delete meal. Please try again.");
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
        <Typography variant="h6">Nutrition Tracker</Typography>
        <Button variant="contained" color="primary" onClick={handleAddMeal}>
          Add Meal
        </Button>
      </Box>
      {nutritionEntries.length > 0 ? (
        <Grid container spacing={2}>
          {nutritionEntries.map((entry) => (
            <Grid item xs={12} key={entry._id}>
              <Box sx={{ p: 2, backgroundColor: "#f8fafc", borderRadius: 1 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                  {entry.food}
                </Typography>
                <Typography variant="body2">
                  Quantity: {entry.quantity} | Calories: {entry.calories}
                </Typography>
                <Button
                  variant="outlined"
                  color="secondary"
                  onClick={() => handleDeleteMeal(entry._id)}
                  sx={{ mt: 1 }}
                >
                  Delete
                </Button>
              </Box>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body1" color="text.secondary">
          No meals recorded yet. Start adding your meals!
        </Typography>
      )}
    </Paper>
  );
};
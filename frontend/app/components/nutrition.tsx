import { useEffect, useState } from "react";
import { Box, Button, Typography, Paper, CircularProgress, Alert, Grid, TextField } from "@mui/material";
import axios from "axios";

interface NutritionEntry {
  _id: string;
  userId: string;
  food: string;
  quantity: string;
  calories: number;
  createdAt: string;
  protein?: number;
  carbs?: number;
  fat?: number;
  mealType?: string;
}

interface NutritionSectionProps {
  userId: string;
}

export const NutritionSection = ({ userId }: NutritionSectionProps) => {
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newMeal, setNewMeal] = useState({ food: "", quantity: "", calories: 0, protein: 0, carbs: 0, fat: 0, mealType: "" });

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
      } catch (err: any) {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMeal((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddMeal = async () => {
    if (!newMeal.food || !newMeal.quantity || newMeal.calories <= 0) {
      setError("All fields are required and calories must be positive.");
      return;
    }

    try {
      const response = await axios.post("/api/nutrition", { ...newMeal, userId });
      setNutritionEntries((prev) => [...prev, response.data]);
      setNewMeal({ food: "", quantity: "", calories: 0, protein: 0, carbs: 0, fat: 0, mealType: "" });
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
        <Box display="flex" gap={2}>
          <TextField
            label="Food"
            name="food"
            value={newMeal.food}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Quantity"
            name="quantity"
            value={newMeal.quantity}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Calories"
            name="calories"
            type="number"
            value={newMeal.calories}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Protein (g)"
            name="protein"
            type="number"
            value={newMeal.protein}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Carbs (g)"
            name="carbs"
            type="number"
            value={newMeal.carbs}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Fat (g)"
            name="fat"
            type="number"
            value={newMeal.fat}
            onChange={handleInputChange}
            size="small"
          />
          <TextField
            label="Meal Type"
            name="mealType"
            value={newMeal.mealType}
            onChange={handleInputChange}
            size="small"
            select
            SelectProps={{ native: true }}
          >
            <option value="">Select</option>
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </TextField>
          <Button variant="contained" color="primary" onClick={handleAddMeal}>
            Add Meal
          </Button>
        </Box>
      </Box>
      {/* Macro Totals */}
      <Box mb={2}>
        <Typography variant="subtitle2">Today's Totals:</Typography>
        <Typography variant="body2">
          Calories: {nutritionEntries.reduce((sum, e) => sum + (e.calories || 0), 0)} kcal | Protein: {nutritionEntries.reduce((sum, e) => sum + (e.protein || 0), 0)}g | Carbs: {nutritionEntries.reduce((sum, e) => sum + (e.carbs || 0), 0)}g | Fat: {nutritionEntries.reduce((sum, e) => sum + (e.fat || 0), 0)}g
        </Typography>
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
                  Quantity: {entry.quantity} | Calories: {entry.calories} | Protein: {entry.protein || 0}g | Carbs: {entry.carbs || 0}g | Fat: {entry.fat || 0}g | Meal: {entry.mealType || '--'}
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
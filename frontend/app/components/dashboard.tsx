import { useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, LinearProgress, Alert } from "@mui/material";
import { Profile, Workout, NutritionEntry } from "../types";

interface DashboardProps {
  userId: string;
  profile: Profile | null;
  workouts: Workout[];
  nutritionEntries: NutritionEntry[];
}

export const Dashboard = ({ userId, profile, workouts, nutritionEntries }: DashboardProps) => {
  const [insights, setInsights] = useState<string[]>([]);
  const [progress, setProgress] = useState<{ label: string; value: number; target: number }[]>([]);

  useEffect(() => {
    generateInsights();
    calculateProgress();
  }, [profile, workouts, nutritionEntries]);

  const generateInsights = () => {
    const newInsights: string[] = [];
    
    const todayCalories = nutritionEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
    const todayProtein = nutritionEntries.reduce((sum, e) => sum + (e.protein || 0), 0);
    const tdee = profile ? calculateTDEE(profile) : 0;
    
    if (profile?.goal === 'lose' && todayCalories > tdee) {
      newInsights.push("You're above your calorie target for weight loss. Consider reducing portions.");
    } else if (profile?.goal === 'gain' && todayCalories < tdee) {
      newInsights.push("You're below your calorie target for muscle gain. Consider adding a snack.");
    }

    if (todayProtein < 0.8 * (profile?.weight || 0)) {
      newInsights.push("Your protein intake is below the recommended 0.8g per kg of body weight.");
    }

    const recentWorkouts = workouts.slice(-5);
    const prs = recentWorkouts.filter(w => w.pr);
    if (prs.length > 0) {
      newInsights.push(`Great job! You've set ${prs.length} new personal records recently.`);
    }

    setInsights(newInsights);
  };

  const calculateProgress = () => {
    const progressItems = [];
    
    if (profile) {
      const tdee = calculateTDEE(profile);
      const todayCalories = nutritionEntries.reduce((sum, e) => sum + (e.calories || 0), 0);
      progressItems.push({
        label: "Daily Calories",
        value: todayCalories,
        target: tdee
      });
    }

    const weeklyWorkouts = workouts.filter(w => {
      const workoutDate = new Date(w.date || '');
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return workoutDate >= weekAgo;
    });

    progressItems.push({
      label: "Weekly Workouts",
      value: weeklyWorkouts.length,
      target: 3
    });

    setProgress(progressItems);
  };

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom>Your Fitness Dashboard</Typography>
      
      <Box mb={3}>
        <Typography variant="subtitle1" gutterBottom>Progress</Typography>
        <Grid container spacing={2}>
          {progress.map((item, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Box mb={1}>
                <Typography variant="body2">{item.label}</Typography>
                <LinearProgress 
                  variant="determinate" 
                  value={(item.value / item.target) * 100} 
                  sx={{ height: 10, borderRadius: 5 }}
                />
                <Typography variant="caption">
                  {item.value} / {item.target} target
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box>
        <Typography variant="subtitle1" gutterBottom>Insights</Typography>
        {insights.length > 0 ? (
          insights.map((insight, index) => (
            <Alert severity="info" key={index} sx={{ mb: 1 }}>
              {insight}
            </Alert>
          ))
        ) : (
          <Typography variant="body2" color="text.secondary">
            Keep tracking your nutrition and workouts to get personalized insights!
          </Typography>
        )}
      </Box>
    </Paper>
  );
};

function calculateBMR(profile: Profile) {
  if (!profile.weight || !profile.height || !profile.age || profile.gender === undefined) return 0;
  const weight = profile.weight;
  const height = profile.height;
  const age = profile.age;
  const gender = profile.gender;
  if (gender === 0) {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

function calculateTDEE(profile: Profile) {
  const bmr = calculateBMR(profile);
  if (!profile.activityLevel) return 0;
  const activityFactors: any = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9,
  };
  return Math.round(bmr * (activityFactors[profile.activityLevel] || 1.2));
} 
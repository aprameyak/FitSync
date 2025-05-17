import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, Grid, Paper, Button, TextField, CircularProgress, Alert } from "@mui/material";
import { Profile } from "../types";

interface ProfileSectionProps {
  userId: string;
}

interface ProfileFormData {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  goal: string;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ userId }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    weight: "0",
    height: "0",
    age: "0",
    gender: "0",
    activityLevel: "sedentary",
    goal: "maintain",
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`/api/profile/${userId}`);
        setProfile(response.data);
        setFormData({
          weight: response.data.weight?.toString() ?? "0",
          height: response.data.height?.toString() ?? "0",
          age: response.data.age?.toString() ?? "0",
          gender: response.data.gender?.toString() ?? "0",
          activityLevel: response.data.activityLevel ?? "sedentary",
          goal: response.data.goal ?? "maintain",
        });
      } catch (err: any) {
        if (err.response?.status === 404) {
          setProfile(null);
        } else {
          setError("Failed to load profile. Please try again.");
        }
      }
      setIsLoading(false);
    };

    fetchProfile();
  }, [userId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (
      !formData.weight ||
      !formData.height ||
      !formData.age ||
      !formData.gender ||
      !formData.activityLevel ||
      !formData.goal
    ) {
      setError("All fields are required.");
      return;
    }

    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (weight <= 0 || height <= 0 || age <= 0) {
      setError("Weight, height, and age must be positive numbers.");
      return;
    }

    const numericFormData = {
      weight,
      height,
      age,
      gender: parseFloat(formData.gender),
      activityLevel: formData.activityLevel,
      goal: formData.goal,
    };

    setError(null);
    try {
      const response = profile
        ? await axios.patch(`/api/profile/${userId}`, numericFormData)
        : await axios.post(`/api/profile`, { ...numericFormData, userId });
      const updatedProfile = profile ? response.data : response.data.profile;
      setProfile(updatedProfile);
      setFormData({
        weight: updatedProfile.weight?.toString() ?? "0",
        height: updatedProfile.height?.toString() ?? "0",
        age: updatedProfile.age?.toString() ?? "0",
        gender: updatedProfile.gender?.toString() ?? "0",
        activityLevel: updatedProfile.activityLevel ?? "sedentary",
        goal: updatedProfile.goal ?? "maintain",
      });
      setIsEditing(false);
    } catch {
      setError("Failed to save profile. Please try again.");
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

  if (!profile && !isEditing) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No profile data available
        </Typography>
        <Button variant="contained" color="primary" onClick={() => setIsEditing(true)} sx={{ mt: 2 }}>
          Create Profile
        </Button>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Profile Information</Typography>
        <Button variant="outlined" onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </Box>

      {isEditing ? (
        <Box component="form" display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Weight (kg)"
            name="weight"
            type="number"
            value={formData.weight}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Height (cm)"
            name="height"
            type="number"
            value={formData.height}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Gender (0 = Male, 1 = Female, 2 = Other)"
            name="gender"
            type="number"
            value={formData.gender}
            onChange={handleInputChange}
            fullWidth
          />
          <TextField
            label="Activity Level"
            name="activityLevel"
            select
            value={formData.activityLevel}
            onChange={handleInputChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="sedentary">Sedentary</option>
            <option value="light">Light</option>
            <option value="moderate">Moderate</option>
            <option value="active">Active</option>
            <option value="very active">Very Active</option>
          </TextField>
          <TextField
            label="Goal"
            name="goal"
            select
            value={formData.goal}
            onChange={handleInputChange}
            fullWidth
            SelectProps={{ native: true }}
          >
            <option value="lose">Lose Weight</option>
            <option value="maintain">Maintain Weight</option>
            <option value="gain">Gain Weight</option>
          </TextField>
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Profile
          </Button>
        </Box>
      ) : (
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Weight: {profile?.weight ?? "--"} kg</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Height: {profile?.height ?? "--"} cm</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Age: {profile?.age ?? "--"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Gender: {profile?.gender ?? "--"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Activity Level: {profile?.activityLevel ?? "--"}</Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="body1">Goal: {profile?.goal ?? "--"}</Typography>
          </Grid>
        </Grid>
      )}
      {profile && (
        <Box mt={2}>
          <Typography variant="subtitle1">BMR: {calculateBMR(profile)} kcal</Typography>
          <Typography variant="subtitle1">TDEE: {calculateTDEE(profile)} kcal</Typography>
        </Box>
      )}
    </Paper>
  );
};

function calculateBMR(profile: Profile) {
  if (!profile.weight || !profile.height || !profile.age || profile.gender === undefined) return '--';
  // Mifflin-St Jeor Equation
  const weight = profile.weight;
  const height = profile.height;
  const age = profile.age;
  const gender = profile.gender;
  if (gender === 0) {
    // Male
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    // Female/Other
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

function calculateTDEE(profile: Profile) {
  const bmr = Number(calculateBMR(profile));
  if (isNaN(bmr) || !profile.activityLevel) return '--';
  const activityFactors: any = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    'very active': 1.9,
  };
  return Math.round(bmr * (activityFactors[profile.activityLevel] || 1.2));
}

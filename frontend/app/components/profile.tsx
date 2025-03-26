import { Box, Typography, Grid, Paper } from "@mui/material";
import { Profile } from "../types";

interface ProfileSectionProps {
  profile: Profile | null;  // Update the type to accept null
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({ profile }) => {
  if (!profile) {
    return (
      <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
        <Typography variant="body1" color="text.secondary">
          No profile data available
        </Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={2} sx={{ p: 3, borderRadius: 2 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Profile Information</Typography>
      </Box>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            Weight: {profile.weight || '--'} kg
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            Height: {profile.height || '--'} cm
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            Age: {profile.age || '--'}
          </Typography>
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <Typography variant="body1">
            Gender: {profile.gender || '--'}
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );
};
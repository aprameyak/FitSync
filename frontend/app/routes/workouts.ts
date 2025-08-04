export const workoutApi = {
  fetchWorkouts: async (userId: string) => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/fitness/${userId}`);
    if (response.status === 404) {
      return [];
    }
    if (!response.ok) throw new Error("Failed to fetch workouts");
    return response.json();
  },
  addWorkout: async (workoutData: any, userId: string) => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/fitness`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...workoutData, userId })
    });
    if (!response.ok) throw new Error("Failed to add workout");
    return response.json();
  },
  deleteWorkout: async (workoutId: string) => {
    const response = await fetch(`${process.env.BACKEND_URL}/api/fitness/${workoutId}`, {
      method: "DELETE"
    });
    if (!response.ok) throw new Error("Failed to delete workout");
    return response.json();
  }
};

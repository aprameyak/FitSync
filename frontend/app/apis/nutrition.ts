  export const nutritionApi = {
    fetchNutrition: async (userId: string) => {
      const response = await fetch(`/api/nutrition/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch nutrition');
      return response.json();
    },
  
    addNutrition: async (nutritionData: any, userId: string) => {
      const response = await fetch("/api/nutrition", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...nutritionData, userId }),
      });
      if (!response.ok) throw new Error('Failed to add nutrition');
      return response.json();
    }
  };
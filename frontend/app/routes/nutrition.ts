import axios from "axios";
import { NutritionEntry } from "../types";

export const nutritionApi = {
  fetchNutrition: async (userId: string): Promise<NutritionEntry[]> => {
    const response = await axios.get(`/api/nutrition/${userId}`);
    return response.data;
  },

  addNutritionEntry: async (userId: string, nutritionData: Omit<NutritionEntry, "id" | "userId">): Promise<NutritionEntry> => {
    const response = await axios.post("/api/nutrition", { ...nutritionData, userId });
    return response.data;
  },

  deleteNutritionEntry: async (id: string): Promise<void> => {
    await axios.delete(`/api/nutrition/${id}`);
  }
};

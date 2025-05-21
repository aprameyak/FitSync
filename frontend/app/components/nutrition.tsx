import { useState, useEffect } from "react";
import { nutritionApi } from "../routes/nutrition";
import { NutritionEntry } from "../types";

interface NutritionSectionProps {
  userId: string;
}

export const NutritionSection = ({ userId }: NutritionSectionProps) => {
  const [entries, setEntries] = useState<NutritionEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newEntry, setNewEntry] = useState({
    food: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchEntries();
  }, [userId]);

  const fetchEntries = async () => {
    try {
      const data = await nutritionApi.fetchNutrition(userId);
      setEntries(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch nutrition entries");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddEntry = async () => {
    try {
      const entry = await nutritionApi.addNutritionEntry(userId, {
        ...newEntry,
        calories: parseInt(newEntry.calories),
        protein: parseFloat(newEntry.protein),
        carbs: parseFloat(newEntry.carbs),
        fat: parseFloat(newEntry.fat)
      });
      setEntries([...entries, entry]);
      setNewEntry({
        food: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
        date: new Date().toISOString().split('T')[0]
      });
    } catch (err: any) {
      setError(err.message || "Failed to add nutrition entry");
    }
  };

  if (isLoading) {
    return (
      <div className="h-full flex justify-center items-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Nutrition Tracker</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newEntry.food}
              onChange={(e) => setNewEntry({ ...newEntry, food: e.target.value })}
              placeholder="Food"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={newEntry.calories}
              onChange={(e) => setNewEntry({ ...newEntry, calories: e.target.value })}
              placeholder="Calories"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newEntry.protein}
              onChange={(e) => setNewEntry({ ...newEntry, protein: e.target.value })}
              placeholder="Protein"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newEntry.carbs}
              onChange={(e) => setNewEntry({ ...newEntry, carbs: e.target.value })}
              placeholder="Carbs"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newEntry.fat}
              onChange={(e) => setNewEntry({ ...newEntry, fat: e.target.value })}
              placeholder="Fat"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="date"
              value={newEntry.date}
              onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleAddEntry}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {entries.map((entry, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">
                    {entry.food}
                  </h4>
                  <p className="text-gray-600">
                    {entry.calories} calories
                  </p>
                  <p className="text-gray-500 text-sm">
                    Protein: {entry.protein}g | Carbs: {entry.carbs}g | Fat: {entry.fat}g
                  </p>
                  <p className="text-gray-500 text-sm">
                    {new Date(entry.date).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => nutritionApi.deleteNutritionEntry(entry.id)}
                  className="text-red-600 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {entries.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No nutrition entries recorded yet. Start tracking your meals!
          </p>
        )}
      </div>
    </div>
  );
};
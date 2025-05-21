import { useState, useEffect } from "react";
import { workoutApi } from "../routes/workouts";
import { Workout } from "../types";

interface WorkoutSectionProps {
  userId: string;
}

export const WorkoutSection = ({ userId }: WorkoutSectionProps) => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newWorkout, setNewWorkout] = useState({
    exercise: "",
    sets: "",
    reps: "",
    weight: "",
    duration: "",
    notes: ""
  });

  useEffect(() => {
    fetchWorkouts();
  }, [userId]);

  const fetchWorkouts = async () => {
    try {
      const data = await workoutApi.fetchWorkouts(userId);
      setWorkouts(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch workouts");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddWorkout = async () => {
    try {
      const workout = await workoutApi.addWorkout(userId, {
        ...newWorkout,
        sets: parseInt(newWorkout.sets),
        reps: parseInt(newWorkout.reps),
        weight: parseFloat(newWorkout.weight),
        duration: parseInt(newWorkout.duration)
      });
      setWorkouts([...workouts, workout]);
      setNewWorkout({
        exercise: "",
        sets: "",
        reps: "",
        weight: "",
        duration: "",
        notes: ""
      });
    } catch (err: any) {
      setError(err.message || "Failed to add workout");
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
          <h2 className="text-xl font-semibold">Workout Tracker</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newWorkout.exercise}
              onChange={(e) => setNewWorkout({ ...newWorkout, exercise: e.target.value })}
              placeholder="Exercise"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={newWorkout.sets}
              onChange={(e) => setNewWorkout({ ...newWorkout, sets: e.target.value })}
              placeholder="Sets"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newWorkout.reps}
              onChange={(e) => setNewWorkout({ ...newWorkout, reps: e.target.value })}
              placeholder="Reps"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newWorkout.weight}
              onChange={(e) => setNewWorkout({ ...newWorkout, weight: e.target.value })}
              placeholder="Weight"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <input
              type="number"
              value={newWorkout.duration}
              onChange={(e) => setNewWorkout({ ...newWorkout, duration: e.target.value })}
              placeholder="Duration"
              className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-20"
            />
            <button
              onClick={handleAddWorkout}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Add
            </button>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Personal Bests:</h3>
          <div className="grid grid-cols-2 gap-4">
            {workouts.map((workout, index) => (
              <div key={index} className="text-sm">
                {workout.exercise}: {workout.weight}kg x {workout.reps}
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          {workouts.map((workout, index) => (
            <div
              key={index}
              className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-lg">
                    {workout.exercise}
                  </h4>
                  <p className="text-gray-600">
                    {workout.sets} sets × {workout.reps} reps
                  </p>
                  <p className="text-gray-500 text-sm">
                    Weight: {workout.weight}kg
                  </p>
                  <p className="text-gray-500 text-sm">
                    Duration: {workout.duration} minutes
                  </p>
                </div>
                <button
                  onClick={() => workoutApi.deleteWorkout(workout.id)}
                  className="text-red-600 hover:text-red-700 focus:outline-none"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {workouts.length === 0 && (
          <p className="text-gray-500 text-center py-4">
            No workouts recorded yet. Start tracking your progress!
          </p>
        )}
      </div>
    </div>
  );
};
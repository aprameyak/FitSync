import { useState } from "react";

interface DashboardProps {
  userId: string;
}

interface ProgressItem {
  label: string;
  value: number;
  target: number;
}

export const Dashboard = ({ userId }: DashboardProps) => {
  const [progress, setProgress] = useState<ProgressItem[]>([
    { label: "Workouts This Week", value: 0, target: 5 },
    { label: "Calories Burned", value: 0, target: 2000 },
    { label: "Steps Today", value: 0, target: 10000 }
  ]);

  const [insights, setInsights] = useState([
    "You're on track to meet your weekly workout goal!",
    "Try to increase your daily step count by 2000 steps.",
    "Your nutrition tracking has been consistent this week."
  ]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Your Fitness Dashboard</h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-3">Progress</h3>
        <div className="space-y-4">
          {progress.map((item, index) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-700">{item.label}</p>
                <p className="text-sm text-gray-500">
                  {item.value} / {item.target}
                </p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${(item.value / item.target) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-3">Insights</h3>
        <div className="space-y-2">
          {insights.map((insight, index) => (
            <div
              key={index}
              className="p-3 bg-blue-50 text-blue-700 rounded-lg"
            >
              {insight}
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-gray-500">
          Keep up the great work! Your consistency is paying off.
        </p>
      </div>
    </div>
  );
}; 
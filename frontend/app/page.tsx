"use client"
import { useEffect, useState, ChangeEvent } from "react";
import { ClerkProvider, SignedIn, SignedOut, SignIn, useUser } from "@clerk/clerk-react";
import axios from "axios";

const clerkFrontendApi = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || "";

interface Profile {
  weight: number;
  height: number;
  age: number;
  gender: string;
}

interface Workout {
  name: string;
}

interface Nutrition {
  food: string;
  calories: number;
}

interface Log {
  exercise: string;
  repetitions: number;
  load: number;
}

function Home() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [nutrition, setNutrition] = useState<Nutrition[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fitnessLog, setFitnessLog] = useState<Log[]>([]);
  const [nutritionLog, setNutritionLog] = useState<Nutrition[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<Partial<Profile>>({});
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      const userId = user.id;

      axios.get(`http://localhost:5000/fitness/${userId}`)
        .then((response) => setWorkouts(response.data))
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setWorkouts([]);
          } else {
            console.error("Error fetching workouts:", error);
          }
        });

      axios.get(`http://localhost:5000/nutrition/${userId}`)
        .then((response) => setNutrition(response.data))
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setNutrition([]);
          } else {
            console.error("Error fetching nutrition:", error);
          }
        });

      axios.get(`http://localhost:5000/profile/${userId}`)
        .then((response) => {
          setProfile(response.data);
          setEditedProfile(response.data);
        })
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setProfile(null);
            setEditedProfile({});
          } else {
            console.error("Error fetching profile:", error);
          }
        });

      axios.get(`http://localhost:5000/media`)
        .then((response) => console.log("Media data:", response.data))
        .catch((error) => console.error("Error fetching media:", error));

      axios.get(`http://localhost:5000/calories/${userId}`)
        .then((response) => console.log("Calories data:", response.data))
        .catch((error) => console.error("Error fetching calories:", error));

      axios.get(`http://localhost:5000/fitness/log/${userId}`)
        .then((response) => setFitnessLog(response.data))
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setFitnessLog([]);
          } else {
            console.error("Error fetching fitness log:", error);
          }
        });

      axios.get(`http://localhost:5000/nutrition/log/${userId}`)
        .then((response) => setNutritionLog(response.data))
        .catch((error) => {
          if (error.response && error.response.status === 404) {
            setNutritionLog([]);
          } else {
            console.error("Error fetching nutrition log:", error);
          }
        });
    }
  }, [user]);

  const handleEditProfile = () => {
    setIsEditing(true);
  };

  const handleSaveProfile = () => {
    const userId = user?.id;
    if (userId) {
      axios.patch(`http://localhost:5000/profile/${userId}`, editedProfile)
        .then((response) => {
          setProfile(response.data);
          setIsEditing(false);
        })
        .catch((error) => console.error("Error updating profile:", error));
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedProfile((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div style={{ display: 'grid', gridTemplateRows: '20px 1fr 20px', alignItems: 'center', justifyItems: 'center', minHeight: '100vh', padding: '8px', paddingBottom: '20px', gap: '16px', fontFamily: 'var(--font-geist-sans)' }}>
      <header style={{ gridRowStart: 1, textAlign: 'center' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold' }}>FitSync</h1>
        <p style={{ fontSize: '1.125rem' }}>Your personal fitness tracker</p>
      </header>
      <main style={{ display: 'flex', flexDirection: 'column', gap: '32px', gridRowStart: 2, alignItems: 'center' }}>
        <SignedIn>
          <section style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Workouts</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {workouts.map((workout, index) => (
                <li key={index}>{workout.name}</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Nutrition</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {nutrition.map((item, index) => (
                <li key={index}>{item.food} - {item.calories} calories</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Profile</h2>
            {profile ? (
              isEditing ? (
                <div>
                  <label>
                    Weight:
                    <input
                      type="number"
                      name="weight"
                      value={editedProfile.weight || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Height:
                    <input
                      type="number"
                      name="height"
                      value={editedProfile.height || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Age:
                    <input
                      type="number"
                      name="age"
                      value={editedProfile.age || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    Gender:
                    <input
                      type="text"
                      name="gender"
                      value={editedProfile.gender || ""}
                      onChange={handleChange}
                    />
                  </label>
                  <button onClick={handleSaveProfile}>Save</button>
                </div>
              ) : (
                <div>
                  <p>Weight: {profile.weight} kg</p>
                  <p>Height: {profile.height} cm</p>
                  <p>Age: {profile.age}</p>
                  <p>Gender: {profile.gender}</p>
                  <button onClick={handleEditProfile}>Edit</button>
                </div>
              )
            ) : (
              <p>Loading profile...</p>
            )}
          </section>

          <section style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Fitness Log</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {fitnessLog.map((log, index) => (
                <li key={index}>{log.exercise} - {log.repetitions} reps - {log.load} kg</li>
              ))}
            </ul>
          </section>

          <section style={{ marginTop: '8px' }}>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>Nutrition Log</h2>
            <ul style={{ listStyleType: 'disc', paddingLeft: '20px' }}>
              {nutritionLog.map((log, index) => (
                <li key={index}>{log.food} - {log.calories} calories</li>
              ))}
            </ul>
          </section>
        </SignedIn>
        <SignedOut>
          <SignIn />
        </SignedOut>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <Home />
    </ClerkProvider>
  );
}

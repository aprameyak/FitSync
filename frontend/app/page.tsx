"use client"
import { ClerkProvider, SignIn, SignedIn, SignedOut, UserButton, useUser } from '@clerk/nextjs';
import { Box, Button, Stack, TextField, CircularProgress } from '@mui/material';
import { useState, useEffect } from 'react';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface Profile {
  weight: string;
  height: string;
  age: string;
  gender: string;
  activityLevel: string;
  fitnessGoal: string;
}

interface Workout {
  name: string;
  sets: number;
  reps: number;
  weight: number;
  date: string;
}

interface NutritionEntry {
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <>
      <div 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          zIndex: 9999
        }} 
        onClick={onClose} 
      />
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: 'white',
        padding: '2rem',
        borderRadius: '12px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        maxWidth: '500px',
        width: '90%',
        zIndex: 10000,
        maxHeight: '90vh',
        overflow: 'auto'
      }}>
        <h2 style={{ marginTop: 0 }}>{title}</h2>
        <button 
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'none',
            border: 'none',
            fontSize: '1.5rem',
            cursor: 'pointer',
            color: '#4a5568'
          }}
          onClick={onClose}
        >
          ×
        </button>
        {children}
      </div>
    </>
  );
};

export default function Home() {
  const { user, isLoaded } = useUser();
  
  // States for modals
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [isNutritionModalOpen, setIsNutritionModalOpen] = useState(false);

  // Chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: 'Hello! How can I help you with your fitness journey today?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');

  // Profile state
  const [profile, setProfile] = useState<Profile>({
    weight: '',
    height: '',
    age: '',
    gender: '',
    activityLevel: '',
    fitnessGoal: ''
  });

  // Workout state
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkout, setNewWorkout] = useState<Workout>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Nutrition state
  const [nutritionEntries, setNutritionEntries] = useState<NutritionEntry[]>([]);
  const [newNutrition, setNewNutrition] = useState<NutritionEntry>({
    food: '',
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    date: new Date().toISOString().split('T')[0]
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user data
  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    setIsLoading(true);
    try {
      await Promise.all([
        fetchProfile(user!.id),
        fetchWorkouts(user!.id),
        fetchNutrition(user!.id)
      ]);
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
    setIsLoading(false);
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage: ChatMessage = {
      role: 'user',
      content: inputMessage
    };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input field
    setInputMessage('');

    try {
      // Make API call to your chat endpoint
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: inputMessage,
          userId: user?.id
        }),
      });

      if (response.ok) {
        const data = await response.json();
        // Add assistant's response to chat
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.message
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        // Handle error
        console.error('Failed to get response from chat API');
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: 'Sorry, I encountered an error. Please try again.'
        }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    }
  };
  // API functions
  const fetchProfile = async (userId: string) => {
    try {
      const response = await fetch(`/api/profile/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateProfile = async (profileData: Profile) => {
    try {
      const response = await fetch('/api/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...profileData, userId: user?.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setProfile(data);
        setIsProfileModalOpen(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const fetchWorkouts = async (userId: string) => {
    try {
      const response = await fetch(`/api/fitness/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setWorkouts(data);
      }
    } catch (error) {
      console.error('Error fetching workouts:', error);
    }
  };

  const addWorkout = async (workoutData: Workout) => {
    try {
      const response = await fetch('/api/fitness', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...workoutData, userId: user?.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setWorkouts(prev => [...prev, data]);
        setIsWorkoutModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding workout:', error);
    }
  };

  const fetchNutrition = async (userId: string) => {
    try {
      const response = await fetch(`/api/nutrition/${userId}`);
      if (response.ok) {
        const data = await response.json();
        setNutritionEntries(data);
      }
    } catch (error) {
      console.error('Error fetching nutrition entries:', error);
    }
  };

  const addNutrition = async (nutritionData: NutritionEntry) => {
    try {
      const response = await fetch('/api/nutrition', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...nutritionData, userId: user?.id }),
      });
      if (response.ok) {
        const data = await response.json();
        setNutritionEntries(prev => [...prev, data]);
        setIsNutritionModalOpen(false);
      }
    } catch (error) {
      console.error('Error adding nutrition entry:', error);
    }
  };
  return (
    <div>
      <div>
      <SignedOut>
        <Box
          width="100vw"
          height="100vh"
          display="flex"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
        >
          <SignIn routing="hash" />
        </Box>
      </SignedOut>

      <SignedIn>
        <div style={{ padding: '2rem', minHeight: '100vh', backgroundColor: '#f7fafc' }}>
          {/* Header */}
          <header style={{ 
            textAlign: 'center', 
            marginBottom: '2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '1rem'
          }}>
            <h1 style={{ fontSize: '2.5rem', color: '#2c5282', margin: 0 }}>FitSync</h1>
            <UserButton />
          </header>

          {isLoading ? (
            <Box display="flex" justifyContent="center" alignItems="center" height="50vh">
              <CircularProgress />
            </Box>
          ) : (
            <main style={{ maxWidth: '1200px', margin: '0 auto' }}>
              {/* Profile Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{ margin: 0 }}>Profile</h2>
                  <button 
                    onClick={() => setIsProfileModalOpen(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  <div>Weight: {profile.weight || '--'} kg</div>
                  <div>Height: {profile.height || '--'} cm</div>
                  <div>Age: {profile.age || '--'}</div>
                  <div>Gender: {profile.gender || '--'}</div>
                  <div>Activity Level: {profile.activityLevel || '--'}</div>
                  <div>Fitness Goal: {profile.fitnessGoal || '--'}</div>
                </div>
              </div>

              {/* Workout Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{ margin: 0 }}>Workouts</h2>
                  <button 
                    onClick={() => setIsWorkoutModalOpen(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Add Workout
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {workouts.map((workout, index) => (
                    <div key={index} style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{workout.name}</h3>
                        <p style={{ margin: 0, color: '#718096' }}>
                          {workout.sets} sets × {workout.reps} reps @ {workout.weight}kg
                        </p>
                      </div>
                      <div style={{ color: '#718096' }}>{new Date(workout.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Nutrition Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '2rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  marginBottom: '1rem'
                }}>
                  <h2 style={{ margin: 0 }}>Nutrition</h2>
                  <button 
                    onClick={() => setIsNutritionModalOpen(true)}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Add Food
                  </button>
                </div>
                <div style={{ maxHeight: '300px', overflow: 'auto' }}>
                  {nutritionEntries.map((entry, index) => (
                    <div key={index} style={{
                      padding: '1rem',
                      borderBottom: '1px solid #e2e8f0',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div>
                        <h3 style={{ margin: '0 0 0.5rem 0' }}>{entry.food}</h3>
                        <p style={{ margin: 0, color: '#718096' }}>
                          Calories: {entry.calories} | Protein: {entry.protein}g | 
                          Carbs: {entry.carbs}g | Fat: {entry.fat}g
                        </p>
                      </div>
                      <div style={{ color: '#718096' }}>{new Date(entry.date).toLocaleDateString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Chat Section */}
              <div style={{ 
                backgroundColor: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
              }}>
                <h2>AI Assistant</h2>
                <div style={{ height: '400px', overflow: 'auto', marginBottom: '1rem', padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                  {messages.map((message, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: message.role === 'user' ? 'flex-end' : 'flex-start',
                      marginBottom: '1rem'
                    }}>
                      <div style={{
                        backgroundColor: message.role === 'user' ? '#4299e1' : '#f7fafc',
                        color: message.role === 'user' ? 'white' : 'black',
                        padding: '0.75rem 1rem',
                        borderRadius: '8px',
                        maxWidth: '70%'
                      }}>
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    style={{
                      flex: 1,
                      padding: '0.75rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      fontSize: '1rem'
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    style={{
                      padding: '0.75rem 1.5rem',
                      backgroundColor: '#4299e1',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    Send
                  </button>
                </div>
              </div>
            </main>
          )}

          {/* Modals */}
          <Modal 
            isOpen={isProfileModalOpen}
            onClose={() => setIsProfileModalOpen(false)}
            title="Edit Profile"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              updateProfile(profile);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="number"
                placeholder="Weight (kg)"
                value={profile.weight}
                onChange={(e) => setProfile({...profile, weight: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Height (cm)"
                value={profile.height}
                onChange={(e) => setProfile({...profile, height: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Age"
                value={profile.age}
                onChange={(e) => setProfile({...profile, age: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <select
                value={profile.gender}
                onChange={(e) => setProfile({...profile, gender: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <select
                value={profile.activityLevel}
                onChange={(e) => setProfile({...profile, activityLevel: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Activity Level</option>
                <option value="sedentary">Sedentary</option>
                <option value="light">Lightly Active</option>
                <option value="moderate">Moderately Active</option>
                <option value="very">Very Active</option>
                <option value="extra">Extra Active</option>
              </select>
              <select
                value={profile.fitnessGoal}
                onChange={(e) => setProfile({...profile, fitnessGoal: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              >
                <option value="">Select Fitness Goal</option>
                <option value="lose">Lose Weight</option>
                <option value="maintain">Maintain Weight</option>
                <option value="gain">Gain Weight</option>
                <option value="muscle">Build Muscle</option>
              </select>
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Save Profile
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={isWorkoutModalOpen}
            onClose={() => setIsWorkoutModalOpen(false)}
            title="Add Workout"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              addWorkout(newWorkout);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Exercise name"
                value={newWorkout.name}
                onChange={(e) => setNewWorkout({...newWorkout, name: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Sets"
                value={newWorkout.sets || ''}
                onChange={(e) => setNewWorkout({...newWorkout, sets: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Reps"
                value={newWorkout.reps || ''}
                onChange={(e) => setNewWorkout({...newWorkout, reps: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Weight (kg)"
                value={newWorkout.weight || ''}
                onChange={(e) => setNewWorkout({...newWorkout, weight: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="date"
                value={newWorkout.date}
                onChange={(e) => setNewWorkout({...newWorkout, date: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Add Workout
              </button>
            </form>
          </Modal>

          <Modal
            isOpen={isNutritionModalOpen}
            onClose={() => setIsNutritionModalOpen(false)}
            title="Add Food"
          >
            <form onSubmit={(e) => {
              e.preventDefault();
              addNutrition(newNutrition);
            }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input
                type="text"
                placeholder="Food name"
                value={newNutrition.food}
                onChange={(e) => setNewNutrition({...newNutrition, food: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Calories"
                value={newNutrition.calories || ''}
                onChange={(e) => setNewNutrition({...newNutrition, calories: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Protein (g)"
                value={newNutrition.protein || ''}
                onChange={(e) => setNewNutrition({...newNutrition, protein: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Carbs (g)"
                value={newNutrition.carbs || ''}
                onChange={(e) => setNewNutrition({...newNutrition, carbs: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="number"
                placeholder="Fat (g)"
                value={newNutrition.fat || ''}
                onChange={(e) => setNewNutrition({...newNutrition, fat: Number(e.target.value)})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <input
                type="date"
                value={newNutrition.date}
                onChange={(e) => setNewNutrition({...newNutrition, date: e.target.value})}
                style={{
                  padding: '0.75rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  fontSize: '1rem'
                }}
              />
              <button
                type="submit"
                style={{
                  padding: '0.75rem',
                  backgroundColor: '#4299e1',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '1rem'
                }}
              >
                Add Food
              </button>
            </form>
          </Modal>
        </div>
      </SignedIn>
      </div>
    </div>
  );
}

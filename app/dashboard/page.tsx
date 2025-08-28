'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Activity, Dumbbell, Target, TrendingUp, Calendar, BarChart3, Bot, LogOut, User } from 'lucide-react'
import Link from 'next/link'

interface DashboardData {
  todayCalories: number
  weeklyWorkouts: number
  currentWeight: number
  weeklyGoalProgress: number
  recentWorkouts: Array<{
    id: string
    name: string
    date: string
    duration: number
  }>
  progressData: {
    weightGoal: number
    weightProgress: number
    workoutGoal: number
    workoutProgress: number
    calorieGoal: number
    calorieProgress: number
  }
}

export default function DashboardPage() {
  const { user, loading, logout } = useAuth()
  const router = useRouter()
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [dataLoading, setDataLoading] = useState(true)

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  useEffect(() => {
    if (user) {
      fetchDashboardData()
    }
  }, [user])

  const fetchDashboardData = async () => {
    try {
      // In a real app, this would fetch from your API
      // For now, we'll simulate data based on user
      const mockData: DashboardData = {
        todayCalories: 1847,
        weeklyWorkouts: 4,
        currentWeight: 165,
        weeklyGoalProgress: 85,
        recentWorkouts: [
          {
            id: '1',
            name: 'Upper Body Strength',
            date: 'Yesterday',
            duration: 45
          },
          {
            id: '2',
            name: 'Cardio Session',
            date: '2 days ago',
            duration: 30
          },
          {
            id: '3',
            name: 'Lower Body Focus',
            date: '3 days ago',
            duration: 50
          }
        ],
        progressData: {
          weightGoal: 160,
          weightProgress: 75,
          workoutGoal: 5,
          workoutProgress: 4,
          calorieGoal: 2000,
          calorieProgress: 1847
        }
      }
      
      setDashboardData(mockData)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setDataLoading(false)
    }
  }

  const handleLogout = async () => {
    await logout()
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">FitSync</span>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="#dashboard" className="text-gray-600 hover:text-gray-900 transition-colors">
                Dashboard
              </a>
              <a href="#workouts" className="text-gray-600 hover:text-gray-900 transition-colors">
                Workouts
              </a>
              <a href="#nutrition" className="text-gray-600 hover:text-gray-900 transition-colors">
                Nutrition
              </a>
              <a href="#progress" className="text-gray-600 hover:text-gray-900 transition-colors">
                Progress
              </a>
              <Link 
                href="/chat" 
                className="text-gray-600 hover:text-gray-900 transition-colors flex items-center space-x-1"
              >
                <Bot className="h-4 w-4" />
                <span>AI Coach</span>
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{user.name || user.email}</span>
              </div>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name || 'User'}
          </h1>
          <p className="text-gray-600">Track your fitness journey and stay motivated</p>
        </section>

        {dashboardData && (
          <>
            {/* Quick Stats */}
            <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Today's Calories</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.todayCalories}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Activity className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Workouts This Week</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.weeklyWorkouts}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <Dumbbell className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Current Weight</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.currentWeight} lbs</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Target className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>
              
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Weekly Goal</p>
                    <p className="text-2xl font-bold text-gray-900">{dashboardData.weeklyGoalProgress}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                    <TrendingUp className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </section>

            {/* Recent Activity */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Workouts</h2>
                  <Button variant="ghost" size="sm">View All</Button>
                </div>
                <div className="space-y-4">
                  {dashboardData.recentWorkouts.map((workout) => (
                    <div key={workout.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{workout.name}</p>
                        <p className="text-sm text-gray-600">{workout.date} • {workout.duration} minutes</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
                  <Button variant="ghost" size="sm">View Details</Button>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weight Goal</span>
                    <span className="text-sm font-medium text-gray-900">{dashboardData.progressData.weightGoal} lbs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${dashboardData.progressData.weightProgress}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Weekly Workouts</span>
                    <span className="text-sm font-medium text-gray-900">
                      {dashboardData.progressData.workoutProgress}/{dashboardData.progressData.workoutGoal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-600 h-2 rounded-full" 
                      style={{ width: `${(dashboardData.progressData.workoutProgress / dashboardData.progressData.workoutGoal) * 100}%` }}
                    ></div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Calorie Goal</span>
                    <span className="text-sm font-medium text-gray-900">
                      {dashboardData.progressData.calorieProgress}/{dashboardData.progressData.calorieGoal}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-orange-600 h-2 rounded-full" 
                      style={{ width: `${(dashboardData.progressData.calorieProgress / dashboardData.progressData.calorieGoal) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </section>

            {/* AI Coach CTA */}
            <section className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold mb-2">Need Fitness Advice?</h2>
                  <p className="text-blue-100">Get personalized guidance from our AI coach powered by Gemini</p>
                </div>
                <Link href="/chat">
                  <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                    <Bot className="h-5 w-5 mr-2" />
                    Chat with AI Coach
                  </Button>
                </Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  )
}

'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Activity, Dumbbell, Target, TrendingUp, Calendar, BarChart3, Bot, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {
  const { data: session, status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    return null // This shouldn't happen due to middleware, but just in case
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
                <span>{session.user?.name || session.user?.email}</span>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => signOut({ callbackUrl: '/sign-in' })}
                className="flex items-center space-x-1"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
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
            Welcome back, {session.user?.name || 'User'}!
          </h1>
          <p className="text-gray-600">Track your fitness journey and stay motivated</p>
        </section>

        {/* Quick Stats */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Calories</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                <p className="text-2xl font-bold text-gray-900">0</p>
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
                <p className="text-2xl font-bold text-gray-900">--</p>
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
                <p className="text-2xl font-bold text-gray-900">0%</p>
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
              <div className="text-center py-8 text-gray-500">
                <Dumbbell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No workouts yet</p>
                <p className="text-sm">Start your fitness journey today!</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
              <Button variant="ghost" size="sm">View Details</Button>
            </div>
            <div className="space-y-4">
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No progress data yet</p>
                <p className="text-sm">Track your first workout to see progress!</p>
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
      </main>
    </div>
  )
}

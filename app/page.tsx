'use client'

import { Button } from '@/components/ui/button'
import { Activity, Dumbbell, Bot } from 'lucide-react'
import Link from 'next/link'

export default function HomePage() {

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
            <div className="flex items-center space-x-3">
              <Link href="/sign-in">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main>
        <section className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
            Track Your Fitness{' '}

          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Modern fitness tracking with AI-powered insights, personalized workouts, 
            and comprehensive progress analytics.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-4">
                Get Started
              </Button>
            </Link>
            <Link href="/sign-in">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                Sign In
              </Button>
            </Link>
          </div>
        </section>

        {/* Features Section */}
        <section className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Dumbbell className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Workout Tracking</h3>
              <p className="text-gray-600">Log your workouts, track progress, and monitor your strength gains with detailed analytics.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Activity className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Nutrition Logging</h3>
              <p className="text-gray-600">Track your daily nutrition, monitor calories, and maintain a balanced diet for optimal results.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Bot className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">AI Coach</h3>
              <p className="text-gray-600">Get personalized fitness advice and workout recommendations from our AI-powered coach.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 FitSync. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

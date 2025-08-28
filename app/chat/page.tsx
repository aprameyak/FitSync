'use client'

import { useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import ChatInterface from '@/components/chat/ChatInterface'
import { Button } from '@/components/ui/button'
import { Bot, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in')
    }
  }, [user, loading, router])

  if (loading) {
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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center space-x-4 mb-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Coach Chat</h1>
            <p className="text-gray-600">
              Ask me anything about fitness, nutrition, workouts, or health goals
            </p>
          </div>
          
          <div className="h-[600px]">
            <ChatInterface 
              userContext={{
                age: 25, // This would come from user profile
                weight: 70,
                height: 175,
                activityLevel: 'moderate',
                goals: 'Build muscle and improve strength'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

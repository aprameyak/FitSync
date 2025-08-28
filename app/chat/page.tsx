'use client'

import { useSession } from 'next-auth/react'
import ChatInterface from '@/components/chat/ChatInterface'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ChatPage() {
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
                name: session.user?.name || 'User',
                email: session.user?.email || '',
                age: 25, // This should come from user profile
                weight: 70, // This should come from user profile
                height: 175, // This should come from user profile
                activityLevel: 'moderate', // This should come from user profile
                goals: 'Build muscle and improve strength' // This should come from user profile
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'
import ChatInterface from '@/components/chat/ChatInterface'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Bot, Key, Eye, EyeOff } from 'lucide-react'

export default function ChatPage() {
  const [apiKey, setApiKey] = useState('')
  const [showApiKey, setShowApiKey] = useState(false)
  const [isStarted, setIsStarted] = useState(false)

  const handleStartChat = () => {
    if (apiKey.trim()) {
      setIsStarted(true)
    }
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Bot className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">FitSync AI Coach</h1>
            <p className="text-gray-600">
              Get personalized fitness and nutrition advice powered by Gemini AI
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium text-gray-700 mb-2">
                Gemini API Key
              </label>
              <div className="relative">
                <Input
                  id="apiKey"
                  type={showApiKey ? 'text' : 'password'}
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="Enter your Gemini API key"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              onClick={handleStartChat}
              disabled={!apiKey.trim()}
              className="w-full"
            >
              <Key className="h-4 w-4 mr-2" />
              Start Chat
            </Button>

            <div className="text-xs text-gray-500 text-center">
              <p>Your API key is stored locally and never sent to our servers.</p>
              <p className="mt-1">
                Get your free API key at{' '}
                <a
                  href="https://makersuite.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Google AI Studio
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Coach Chat</h1>
            <p className="text-gray-600">
              Ask me anything about fitness, nutrition, workouts, or health goals
            </p>
          </div>
          
          <div className="h-[600px]">
            <ChatInterface 
              apiKey={apiKey}
              userContext={{
                age: 25,
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

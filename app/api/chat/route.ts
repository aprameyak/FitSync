import { NextRequest, NextResponse } from 'next/server'
import { chatWithGemini, getFitnessAdvice } from '@/lib/gemini'

export async function POST(request: NextRequest) {
  try {
    const { message, userContext, conversationHistory } = await request.json()

    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        { error: 'Gemini API key not configured' },
        { status: 500 }
      )
    }

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required and must be a string' },
        { status: 400 }
      )
    }

    // If user context is provided, use fitness advice function
    if (userContext) {
      const result = await getFitnessAdvice(apiKey, userContext, message)
      
      if (!result.success) {
        return NextResponse.json(
          { error: result.error },
          { status: 500 }
        )
      }

      return NextResponse.json({
        message: result.message,
        success: true
      })
    }

    // Otherwise, use regular chat
    const result = await chatWithGemini(apiKey, message, conversationHistory)
    
    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 500 }
      )
    }

    return NextResponse.json({
      message: result.message,
      success: true
    })

  } catch (error) {
    console.error('Chat API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

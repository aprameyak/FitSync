import { GoogleGenerativeAI, Part } from '@google/generative-ai'

let genAI: GoogleGenerativeAI | null = null

export function initializeGemini(apiKey: string) {
  if (!genAI) {
    genAI = new GoogleGenerativeAI(apiKey)
  }
  return genAI
}

export async function chatWithGemini(
  apiKey: string,
  message: string,
  conversationHistory: Array<{ role: 'user' | 'model'; parts: Part[] }> = []
) {
  try {
    const genAI = initializeGemini(apiKey)
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' })

    // Create chat session
    const chat = model.startChat({
      history: conversationHistory,
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.7,
      },
    })

    // Send message and get response
    const result = await chat.sendMessage(message)
    const response = await result.response
    const text = response.text()

    return {
      success: true,
      message: text,
      error: null
    }
  } catch (error) {
    console.error('Gemini API Error:', error)
    return {
      success: false,
      message: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }
  }
}

export async function getFitnessAdvice(
  apiKey: string,
  userContext: {
    age?: number
    weight?: number
    height?: number
    activityLevel?: string
    goals?: string
  },
  question: string
) {
  const contextPrompt = `
You are FitSync, a helpful fitness and nutrition coach. 

User Context:
- Age: ${userContext.age || 'Not specified'}
- Weight: ${userContext.weight || 'Not specified'} kg
- Height: ${userContext.height || 'Not specified'} cm
- Activity Level: ${userContext.activityLevel || 'Not specified'}
- Goals: ${userContext.goals || 'Not specified'}

Please provide helpful, accurate, and safe fitness and nutrition advice. Always recommend consulting with healthcare professionals for medical concerns. Keep responses concise but informative.
`

  return chatWithGemini(apiKey, `${contextPrompt}\n\nUser Question: ${question}`)
}

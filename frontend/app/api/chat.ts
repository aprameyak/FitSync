import { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { message, chatHistory } = req.body;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a knowledgeable fitness coach. Provide helpful, encouraging advice about exercise, nutrition, and wellness."
        },
        ...chatHistory.map((msg: any) => ({
          role: msg.role,
          content: msg.content
        })),
        {
          role: "user",
          content: message
        }
      ],
    });

    const aiResponse = completion.choices[0]?.message?.content || "Sorry, I couldn't generate a response.";
    res.status(200).json({ response: aiResponse });
  } catch (error) {
    console.error('Error in AI API:', error);
    res.status(500).json({ message: 'Error processing your request' });
  }
}

import { GoogleGenerativeAI } from '@google/generative-ai';
import { StreamingTextResponse } from 'ai';

// Initialize the GoogleGenerativeAI with your API key
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GOOGLE_API_KEY || '');

// IMPORTANT! Set the runtime to edge
export const runtime = 'edge';

// Initialize the generative model
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// Define the prompt for generating content
const buildGoogleGenAIPrompt = (topic, numQuestions) => (
  `Generate a quiz on ${topic} with ${numQuestions} questions.`
);

export async function POST(req) {
  try {
    // Extract the `topic` and `numQuestions` from the request body
    const { topic, numQuestions } = await req.json();

    // Validate input
    if (!topic || typeof numQuestions !== 'number') {
      return new Response('Invalid request parameters', { status: 400 });
    }

    // Generate content using the Google GenAI model
    const prompt = buildGoogleGenAIPrompt(topic, numQuestions);
    const result = await model.generateContent(prompt);

    // Respond with the generated content
    return new StreamingTextResponse(result.response.text());
  } catch (error) {
    console.error('Error in POST request:', error);
    return new Response('Internal Server Error', { status: 500 });
  }
}

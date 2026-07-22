import { ExtractedQuestion } from '../../ocr/types'

/**
 * AI Cleanup Service (Mocked for demonstration).
 * In production, this would call OpenAI (gpt-4-turbo) or Google Gemini
 * passing a system prompt to format, fix typos, and structure into JSON.
 */
export async function cleanupExtractedData(rawText: string): Promise<ExtractedQuestion[]> {
  const OPENAI_API_KEY = process.env.OPENAI_API_KEY
  
  if (!OPENAI_API_KEY) {
    console.warn('[AI Cleanup] API key missing, returning raw data.')
    // Fallback: simple regex split for demonstration
    return [
      {
        id: crypto.randomUUID(),
        content: rawText,
        options: []
      }
    ]
  }

  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 2500))

  return [
    {
      id: crypto.randomUUID(),
      content: 'This is a beautifully AI-cleaned question with fixed LaTeX: $\\int x^2 dx$',
      options: ['Option A', 'Option B', 'Option C', 'Option D'],
    }
  ]
}

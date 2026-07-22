import { OcrResult } from '../types'

/**
 * Mocks Google Document AI API Call (Fallback Engine)
 * Used for heavy text extraction if Mathpix fails or for generic non-math papers.
 */
export async function processWithDocumentAI(fileUrl: string): Promise<OcrResult> {
  const GOOGLE_CLIENT_EMAIL = process.env.GOOGLE_CLIENT_EMAIL
  
  // Ensure credentials exist (Mock check)
  if (!GOOGLE_CLIENT_EMAIL) {
    throw new Error('Google Document AI credentials missing')
  }

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  return {
    rawLatex: '',
    rawText: 'Who was the first president of the United States?\nA) George Washington\nB) Abraham Lincoln',
    questions: [
      {
        id: crypto.randomUUID(),
        content: 'Who was the first president of the United States?',
        options: ['George Washington', 'Abraham Lincoln'],
      }
    ],
    confidenceScore: 0.88,
    engineUsed: 'document-ai'
  }
}

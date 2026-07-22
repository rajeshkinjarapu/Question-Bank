import { OcrResult } from '../types'

/**
 * Mocks Mathpix API Call (Primary Engine for Math/Physics/Chem)
 * Ensures equations are parsed as LaTeX and never images.
 */
export async function processWithMathpix(fileUrl: string): Promise<OcrResult> {
  const MATHPIX_APP_ID = process.env.MATHPIX_APP_ID
  const MATHPIX_APP_KEY = process.env.MATHPIX_APP_KEY

  if (!MATHPIX_APP_ID || !MATHPIX_APP_KEY) {
    throw new Error('Mathpix credentials missing')
  }

  // NOTE: In production, this would make a fetch to https://api.mathpix.com/v3/text
  // For the sake of this architectural demo, we return a mocked structure assuming success.
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  return {
    rawLatex: '\\int_{a}^{b} x^2 dx',
    rawText: 'Calculate the integral of x squared.',
    questions: [
      {
        id: crypto.randomUUID(),
        content: 'Calculate the integral of $x^2$ from $a$ to $b$.',
        options: ['$\\frac{b^3 - a^3}{3}$', '$\\frac{b^2 - a^2}{2}$', '$b-a$'],
      }
    ],
    confidenceScore: 0.95,
    engineUsed: 'mathpix'
  }
}

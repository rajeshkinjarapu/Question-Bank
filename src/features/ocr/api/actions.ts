'use server'

import { processWithMathpix } from './mathpix'
import { processWithDocumentAI } from './document-ai'
import { OcrResult } from '../types'

/**
 * Helper to simulate exponential backoff retry logic.
 */
async function retry<T>(fn: () => Promise<T>, retries = 3, delay = 1000): Promise<T> {
  try {
    return await fn()
  } catch (error) {
    if (retries === 0) throw error
    await new Promise((resolve) => setTimeout(resolve, delay))
    return retry(fn, retries - 1, delay * 2)
  }
}

/**
 * Orchestrates the OCR pipeline: Primary Mathpix -> Fallback Document AI
 */
export async function extractTextFromImage(fileUrl: string): Promise<OcrResult> {
  try {
    // 1. Attempt Mathpix with 2 retries
    console.log('[OCR] Attempting extraction with Mathpix...')
    const result = await retry(() => processWithMathpix(fileUrl), 2)
    
    // Validate confidence
    if (result.confidenceScore < 0.6) {
      console.warn('[OCR] Mathpix confidence too low, falling back to Document AI.')
      throw new Error('Low confidence score')
    }
    
    return result

  } catch (error) {
    console.error('[OCR] Mathpix failed:', error)
    
    // 2. Fallback to Google Document AI
    console.log('[OCR] Falling back to Google Document AI...')
    try {
      const fallbackResult = await retry(() => processWithDocumentAI(fileUrl), 2)
      return fallbackResult
    } catch (fallbackError) {
      console.error('[OCR] Document AI also failed:', fallbackError)
      throw new Error('All OCR engines failed to process the document.')
    }
  }
}

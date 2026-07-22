import { useState, useCallback } from 'react'
import { OcrStatus, OcrResult } from '../types'
import { extractTextFromImage } from '../api/actions'
import { useFileUpload } from '@/hooks/useFileUpload'

export function useOcrPipeline() {
  const [status, setStatus] = useState<OcrStatus>('idle')
  const [result, setResult] = useState<OcrResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const { upload, progress } = useFileUpload({ bucket: 'user-uploads' }) // Assuming temporary bucket

  const processFile = useCallback(async (file: File) => {
    try {
      if (file.size > 100 * 1024 * 1024) {
        throw new Error('File size exceeds 100MB limit.')
      }

      setStatus('uploading')
      setError(null)
      
      // 1. Upload to Supabase Storage temporarily
      const uploadRes = await upload(file)

      // 2. Trigger OCR Server Action
      setStatus('processing')
      const ocrData = await extractTextFromImage(uploadRes.url)

      // 3. Complete
      setResult(ocrData)
      setStatus('preview')

    } catch (err: any) {
      setError(err.message || 'An unknown error occurred during OCR.')
      setStatus('error')
    }
  }, [upload])

  const reset = () => {
    setStatus('idle')
    setResult(null)
    setError(null)
  }

  return { status, result, error, progress, processFile, reset }
}

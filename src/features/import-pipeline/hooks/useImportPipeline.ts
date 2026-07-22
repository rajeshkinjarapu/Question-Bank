'use client'

import { useState } from 'react'
import { BulkUploadZone } from '../components/BulkUploadZone'
import { ImportPreviewGrid } from '../components/ImportPreviewGrid'
import { cleanupExtractedData } from '../api/ai-cleanup'
import { flagDuplicates, DuplicateCheckResult } from '../api/duplicate-check'
import { saveBulkImport } from '../api/actions'

export function useImportPipeline() {
  const [step, setStep] = useState<'upload' | 'processing' | 'preview'>('upload')
  const [fileName, setFileName] = useState('')
  const [progress, setProgress] = useState(0)
  const [previewData, setPreviewData] = useState<DuplicateCheckResult[]>([])
  const [isSaving, setIsSaving] = useState(false)

  const processFile = async (file: File) => {
    setStep('processing')
    setFileName(file.name)
    setProgress(10)

    try {
      // 1. OCR / Parsing (Simulated)
      setProgress(40)
      const rawText = "Extracted raw text from " + file.name
      
      // 2. AI Cleanup
      setProgress(70)
      const cleanedData = await cleanupExtractedData(rawText)

      // 3. Duplicate Detection
      setProgress(90)
      const finalData = await flagDuplicates(cleanedData)

      setPreviewData(finalData)
      setProgress(100)
      setStep('preview')

    } catch (err) {
      console.error(err)
      setStep('upload') // Revert on fail
    }
  }

  const saveImport = async () => {
    setIsSaving(true)
    try {
      await saveBulkImport(fileName, previewData)
      alert('Import successful!')
      setStep('upload') // Reset
    } catch (error) {
      console.error(error)
      alert('Failed to save import')
    } finally {
      setIsSaving(false)
    }
  }

  return {
    step,
    progress,
    previewData,
    isSaving,
    processFile,
    saveImport
  }
}

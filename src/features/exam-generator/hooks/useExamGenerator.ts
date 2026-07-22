'use client'

import { useState } from 'react'
import { ExamBlueprint, BlueprintSection } from '../types/blueprint'
import { draftPaper, commitGeneratedPaper } from '../api/actions'
import { exportPaper } from '../api/export'

export function useExamGenerator() {
  const [step, setStep] = useState<'build' | 'generating' | 'review' | 'saving'>('build')
  const [draft, setDraft] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const generate = async (blueprint: ExamBlueprint) => {
    setStep('generating')
    setError(null)
    
    const { data, error: err } = await draftPaper(blueprint)
    
    if (err) {
      setError(err)
      setStep('build')
    } else {
      setDraft(data)
      setStep('review')
    }
  }

  const commitAndExport = async (format: 'pdf' | 'docx') => {
    setStep('saving')
    try {
      // 1. Save to DB
      await commitGeneratedPaper(draft)
      
      // 2. Trigger Export Service
      const downloadPath = await exportPaper(draft, format)
      
      alert(`Export successful! File path: ${downloadPath}`)
      setStep('build') // Reset or redirect to generated papers list
    } catch (err: any) {
      setError(err.message)
      setStep('review')
    }
  }

  const swapQuestion = (sectionIdx: number, questionId: string) => {
    // Logic to replace a single question with another matching the same criteria
    // e.g. open a modal with alternatives, select one, and mutate 'draft' state
    console.log('Swapping question:', questionId)
  }

  return {
    step,
    draft,
    error,
    generate,
    commitAndExport,
    swapQuestion
  }
}

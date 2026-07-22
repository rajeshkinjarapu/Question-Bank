'use client'

import { useState } from 'react'
import { PaperConfigValues } from '../schema/config'
import { Step1Metadata } from './Step1_Metadata'
import { Step2Weightage } from './Step2_Weightage'
import { Step3Branding } from './Step3_Branding'
import { Step4GenerationMode } from './Step4_GenerationMode'
import { generatePaper } from '../api/actions'
import { Loader2 } from 'lucide-react'

export function GeneratorWizard() {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<Partial<PaperConfigValues>>({
    questionCount: '50',
    durationMinutes: 180,
    marksPositive: 4,
    marksNegative: -1,
    chapterWeightages: [],
    topicWeightages: [],
    questionNumberFormat: 'Q1.',
    pageNumberFormat: 'Page 1 of 5',
    shuffleQuestions: true,
    shuffleOptions: true,
    mode: 'random'
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleNext = (stepData: Partial<PaperConfigValues>) => {
    setFormData(prev => ({ ...prev, ...stepData }))
    setCurrentStep(prev => Math.min(prev + 1, 4))
  }

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  const handleGenerate = async (finalData: Partial<PaperConfigValues>) => {
    const completeData = { ...formData, ...finalData }
    setIsSubmitting(true)
    setError('')
    try {
      const paperId = await generatePaper(completeData)
      alert(`Paper Generated Successfully! ID: ${paperId}`)
      // router.push(`/dashboard/papers/${paperId}/preview`)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto bg-card border rounded-xl shadow-lg overflow-hidden">
      {/* Progress Header */}
      <div className="bg-muted px-8 py-4 border-b flex justify-between items-center text-sm font-medium">
        <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="w-6 h-6 rounded-full bg-background border flex items-center justify-center">1</span> Metadata
        </div>
        <div className="w-12 h-px bg-border" />
        <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="w-6 h-6 rounded-full bg-background border flex items-center justify-center">2</span> Weightage
        </div>
        <div className="w-12 h-px bg-border" />
        <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="w-6 h-6 rounded-full bg-background border flex items-center justify-center">3</span> Branding
        </div>
        <div className="w-12 h-px bg-border" />
        <div className={`flex items-center gap-2 ${currentStep >= 4 ? 'text-primary' : 'text-muted-foreground'}`}>
          <span className="w-6 h-6 rounded-full bg-background border flex items-center justify-center">4</span> Mode
        </div>
      </div>

      {/* Main Content Area */}
      <div className="p-8">
        {error && <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-md text-sm">{error}</div>}
        
        {isSubmitting ? (
          <div className="h-64 flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-primary" />
            <p className="text-muted-foreground font-medium animate-pulse">Compiling Question Paper Engine...</p>
          </div>
        ) : (
          <>
            {currentStep === 1 && <Step1Metadata initialData={formData} onNext={handleNext} />}
            {currentStep === 2 && <Step2Weightage initialData={formData} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 3 && <Step3Branding initialData={formData} onNext={handleNext} onBack={handleBack} />}
            {currentStep === 4 && <Step4GenerationMode initialData={formData} onGenerate={handleGenerate} onBack={handleBack} />}
          </>
        )}
      </div>
    </div>
  )
}

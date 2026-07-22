'use client'

import { useState } from 'react'
import { ExamBlueprint } from '../types/blueprint'

export function BlueprintBuilder({ onGenerate, isGenerating }: { onGenerate: (bp: ExamBlueprint) => void, isGenerating: boolean }) {
  // Simplified state for demonstration
  const [title, setTitle] = useState('JEE Main Mock Test 1')
  const [duration, setDuration] = useState(180)
  
  const handleGenerate = () => {
    const blueprint: ExamBlueprint = {
      examId: 'dummy-exam-id',
      title,
      durationMinutes: duration,
      sections: [
        {
          id: 's1',
          name: 'Physics',
          totalQuestions: 30,
          topicIds: ['topic1', 'topic2'], // Would come from multi-select
          questionTypeIds: ['type1'],
          difficultyDistribution: { easy: 30, medium: 50, hard: 20 },
          customMarks: { positive: 4, negative: 1 }
        }
      ]
    }
    onGenerate(blueprint)
  }

  return (
    <div className="bg-card border rounded-lg p-6 shadow-sm max-w-3xl mx-auto">
      <h2 className="text-xl font-semibold mb-6">Create Exam Blueprint</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Paper Title</label>
          <input 
            type="text" 
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (Minutes)</label>
          <input 
            type="number" 
            value={duration}
            onChange={e => setDuration(Number(e.target.value))}
            className="w-full border rounded-md px-3 py-2 text-sm focus:ring-primary focus:border-primary"
          />
        </div>

        <div className="border rounded-md p-4 bg-muted/20">
          <h3 className="font-medium mb-2 text-sm">Physics Section (Preview)</h3>
          <p className="text-xs text-muted-foreground mb-2">30 Questions • Topics: Kinematics, Thermodynamics • +4/-1</p>
          <div className="flex gap-2">
            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">30% Easy</span>
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">50% Medium</span>
            <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">20% Hard</span>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full mt-6 bg-primary text-primary-foreground py-2 rounded-md font-medium hover:bg-primary/90 disabled:opacity-50 flex justify-center items-center"
        >
          {isGenerating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Querying Database...
            </>
          ) : 'Generate Exam Paper'}
        </button>
      </div>
    </div>
  )
}

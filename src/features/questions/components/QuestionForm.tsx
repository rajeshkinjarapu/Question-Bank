'use client'

// Note: A real implementation would use react-hook-form and Zod validation,
// integrating the RichTextEditor (Phase 7) and FormulaToolbar (Phase 9).

import { useState } from 'react'
import { QuestionFormValues, OptionSchema } from '../schema/validation'

export function QuestionForm({ initialData, onSubmit }: { initialData?: any, onSubmit: (data: any) => void }) {
  const [content, setContent] = useState(initialData?.content || '')
  
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* 1. Taxonomy Section */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Taxonomy & Metadata</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Exam</label>
            <select className="w-full border rounded-md p-2 text-sm"><option>JEE Main</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Subject</label>
            <select className="w-full border rounded-md p-2 text-sm"><option>Physics</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Chapter</label>
            <select className="w-full border rounded-md p-2 text-sm"><option>Kinematics</option></select>
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Question Type</label>
            <select className="w-full border rounded-md p-2 text-sm"><option>MCQ</option></select>
          </div>
        </div>
      </div>

      {/* 2. Content Section (Stubs RichTextEditor) */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Question Statement</h2>
        <div className="h-64 bg-muted border rounded-md flex items-center justify-center text-muted-foreground">
          [RichTextEditor Component with Formula Engine Mounted Here]
        </div>
      </div>

      {/* 3. Options Section */}
      <div className="bg-card border rounded-lg p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Options (MCQ)</h2>
        <div className="space-y-3">
          {['A', 'B', 'C', 'D'].map((opt, i) => (
            <div key={opt} className="flex gap-4 items-center">
              <input type="radio" name="correctOption" className="w-4 h-4 text-primary" defaultChecked={i===0} />
              <div className="flex-1 p-2 bg-muted border rounded-md text-sm text-muted-foreground">
                [EditableFormula Component for Option {opt}]
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-4">
        <button className="px-4 py-2 border rounded-md text-sm hover:bg-accent">Cancel</button>
        <button className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-md text-sm hover:bg-primary/90">
          Save Question
        </button>
      </div>
    </div>
  )
}

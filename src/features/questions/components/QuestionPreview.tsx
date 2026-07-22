import React from 'react'
import { FormulaRenderer } from '../../formula-engine/components/FormulaRenderer'

export function QuestionPreview({ question }: { question: any }) {
  if (!question) return null

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white border rounded shadow-sm text-slate-800">
      <div className="flex justify-between items-start mb-6 pb-4 border-b">
        <div className="space-x-2">
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {question.type?.name || 'MCQ'}
          </span>
          <span className="text-xs font-medium uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {question.difficulty?.name || 'Medium'}
          </span>
        </div>
        <div className="text-xs font-semibold text-slate-400">
          +4 / -1 Marks
        </div>
      </div>

      {/* Render the question content which may contain HTML and MathML/KaTeX tags */}
      <div className="prose max-w-none mb-8 text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: question.content }} />

      <div className="space-y-3">
        {question.options?.map((opt: any, idx: number) => (
          <div key={opt.id} className={`flex p-4 rounded-lg border ${opt.isCorrect ? 'bg-green-50 border-green-200' : 'hover:bg-slate-50'}`}>
            <span className="font-bold mr-4">{String.fromCharCode(65 + idx)}.</span>
            <div className="flex-1" dangerouslySetInnerHTML={{ __html: opt.content }} />
            {opt.isCorrect && <span className="text-green-600 font-bold ml-2">✓</span>}
          </div>
        ))}
      </div>
    </div>
  )
}

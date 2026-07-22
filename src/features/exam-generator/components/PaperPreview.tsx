'use client'

import { GeneratedPaperDraft } from '../types/blueprint'

interface PaperPreviewProps {
  draft: GeneratedPaperDraft
  onCommit: (format: 'pdf' | 'docx') => void
  onSwapQuestion: (sectionIdx: number, qId: string) => void
}

export function PaperPreview({ draft, onCommit, onSwapQuestion }: PaperPreviewProps) {
  return (
    <div className="flex gap-6 max-w-6xl mx-auto h-[80vh]">
      {/* Left: Paper Preview */}
      <div className="flex-1 border rounded-lg bg-card shadow-sm overflow-y-auto">
        <div className="p-8 border-b text-center sticky top-0 bg-card z-10">
          <h1 className="text-2xl font-bold">{draft.blueprint.title}</h1>
          <p className="text-muted-foreground mt-1">Duration: {draft.blueprint.durationMinutes} minutes</p>
        </div>

        <div className="p-8 space-y-10">
          {draft.sections.map((section, sIdx) => (
            <div key={section.sectionName}>
              <h2 className="text-lg font-bold border-b pb-2 mb-4 uppercase">{section.sectionName}</h2>
              <div className="space-y-6">
                {section.questions.map((q, qIdx) => (
                  <div key={q.id} className="group relative pr-12">
                    <div className="flex gap-3">
                      <span className="font-medium shrink-0">{qIdx + 1}.</span>
                      <div className="text-sm font-mono" dangerouslySetInnerHTML={{ __html: q.content }} />
                    </div>
                    {/* Swap Button (appears on hover) */}
                    <button 
                      onClick={() => onSwapQuestion(sIdx, q.id)}
                      className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 p-1.5 bg-muted hover:bg-accent rounded text-xs transition-opacity"
                    >
                      Swap
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Actions Sidebar */}
      <div className="w-80 space-y-4">
        <div className="bg-card border rounded-lg p-4 shadow-sm">
          <h3 className="font-semibold mb-4 border-b pb-2">Export & Save</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Review the paper. Once satisfied, generate the final files and save the configuration to the database.
          </p>
          <div className="space-y-2">
            <button 
              onClick={() => onCommit('pdf')}
              className="w-full px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 transition flex items-center justify-center gap-2"
            >
              Export as PDF
            </button>
            <button 
              onClick={() => onCommit('docx')}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition flex items-center justify-center gap-2"
            >
              Export as Word (DOCX)
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

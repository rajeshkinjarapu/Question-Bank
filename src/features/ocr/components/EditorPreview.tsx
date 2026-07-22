'use client'

import { useState } from 'react'
import { OcrResult } from '../types'

interface EditorPreviewProps {
  result: OcrResult
  onSave: (finalData: any) => void
  onCancel: () => void
}

export function EditorPreview({ result, onSave, onCancel }: EditorPreviewProps) {
  const [content, setContent] = useState(result.rawText || result.rawLatex)

  return (
    <div className="grid grid-cols-2 gap-6 h-[70vh] border rounded-lg overflow-hidden bg-background shadow-sm">
      {/* Left Pane: Extracted Info / Original Image Placeholder */}
      <div className="border-r border-border bg-muted/20 p-6 overflow-y-auto">
        <h3 className="font-semibold text-lg mb-4">OCR Extraction Result</h3>
        
        <div className="space-y-4">
          <div className="p-4 bg-card border rounded-md shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Engine Used</p>
            <p className="capitalize">{result.engineUsed}</p>
          </div>
          
          <div className="p-4 bg-card border rounded-md shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-1">Confidence Score</p>
            <div className="flex items-center space-x-2">
              <div className="h-2 flex-1 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary" 
                  style={{ width: `${result.confidenceScore * 100}%` }}
                />
              </div>
              <span className="text-sm">{(result.confidenceScore * 100).toFixed(0)}%</span>
            </div>
          </div>
          
          <div className="p-4 bg-card border rounded-md shadow-sm">
            <p className="text-sm font-medium text-muted-foreground mb-2">Detected Questions</p>
            {result.questions.map((q, i) => (
              <div key={q.id} className="text-sm mb-3 pb-3 border-b last:border-0 last:mb-0 last:pb-0">
                <span className="font-medium mr-2">Q{i + 1}.</span> 
                {q.content}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Pane: Interactive Editor */}
      <div className="flex flex-col">
        <div className="p-4 border-b border-border bg-card flex justify-between items-center">
          <h3 className="font-semibold">LaTeX / Rich Text Editor</h3>
          <div className="space-x-2">
            <button onClick={onCancel} className="px-3 py-1.5 text-sm border rounded-md hover:bg-muted">Cancel</button>
            <button onClick={() => onSave({ finalContent: content })} className="px-3 py-1.5 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90">Save to DB</button>
          </div>
        </div>
        
        <div className="flex-1 p-0">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full p-4 resize-none focus:outline-none focus:ring-0 bg-transparent font-mono text-sm leading-relaxed"
            placeholder="Edit the extracted LaTeX and text here..."
          />
        </div>
      </div>
    </div>
  )
}

'use client'

import { useState } from 'react'

export function BulkUploadZone({ onProcess }: { onProcess: (file: File) => void }) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) onProcess(file)
  }

  return (
    <div
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-16 text-center transition-all ${
        isDragging ? 'border-primary bg-primary/10' : 'border-border hover:border-primary/50 bg-card'
      }`}
    >
      <div className="mx-auto w-12 h-12 mb-4 bg-muted rounded-full flex items-center justify-center">
        <svg className="w-6 h-6 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
        </svg>
      </div>
      <h3 className="text-lg font-semibold">Bulk Import Questions</h3>
      <p className="text-sm text-muted-foreground mt-2">
        Drag & drop Excel (.xlsx), CSV, Word (.docx), PDF, or Images here.
      </p>
      
      <div className="mt-8 flex justify-center gap-4">
        <button 
          onClick={() => document.getElementById('bulk-upload')?.click()}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition"
        >
          Browse Files
        </button>
        <input 
          id="bulk-upload" 
          type="file" 
          className="hidden" 
          accept=".pdf,.png,.jpg,.jpeg,.docx,.xlsx,.csv"
          onChange={(e) => e.target.files?.[0] && onProcess(e.target.files[0])}
        />
      </div>
    </div>
  )
}

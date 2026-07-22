'use client'

import { useCallback, useEffect } from 'react'

interface UploadZoneProps {
  onFileSelect: (file: File) => void
  disabled?: boolean
}

export function UploadZone({ onFileSelect, disabled }: UploadZoneProps) {
  
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    if (disabled) return
    const files = Array.from(e.dataTransfer.files)
    if (files.length > 0) {
      onFileSelect(files[0]) // Multi-file can be supported here by iterating
    }
  }, [disabled, onFileSelect])

  const handlePaste = useCallback((e: ClipboardEvent) => {
    if (disabled) return
    const items = e.clipboardData?.items
    if (!items) return

    for (let i = 0; i < items.length; i++) {
      if (items[i].type.indexOf('image') !== -1) {
        const file = items[i].getAsFile()
        if (file) onFileSelect(file)
      }
    }
  }, [disabled, onFileSelect])

  useEffect(() => {
    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [handlePaste])

  return (
    <div
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-xl p-12 text-center transition-colors
        ${disabled ? 'bg-muted cursor-not-allowed opacity-50' : 'border-border hover:border-primary cursor-pointer hover:bg-accent/50'}`}
    >
      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-muted rounded-full">
          <svg className="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="text-lg font-medium">Drag & drop files here</p>
          <p className="text-sm text-muted-foreground mt-1">or paste from clipboard (Ctrl+V)</p>
        </div>
        <p className="text-xs text-muted-foreground">Supported: PDF, PNG, JPG, WEBP up to 100MB</p>
      </div>
      
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept=".pdf,.png,.jpg,.jpeg,.webp"
        onChange={(e) => {
          const files = e.target.files
          if (files && files.length > 0) onFileSelect(files[0])
        }}
        disabled={disabled}
      />
      <button 
        disabled={disabled}
        onClick={() => document.getElementById('file-upload')?.click()}
        className="mt-6 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50"
      >
        Browse Files
      </button>
    </div>
  )
}

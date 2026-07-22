'use client'

import { Folder, Brain, Trash2, Globe, FileText } from 'lucide-react'

interface BulkActionBarProps {
  selectedIds: string[]
  onClearSelection: () => void
  onAction: (actionType: string) => void
}

export function BulkActionBar({ selectedIds, onClearSelection, onAction }: BulkActionBarProps) {
  if (selectedIds.length === 0) return null

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-card border rounded-full shadow-2xl px-6 py-3 flex items-center gap-6 z-40">
      <div className="flex items-center gap-3 border-r pr-6">
        <span className="bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full">
          {selectedIds.length}
        </span>
        <span className="text-sm font-medium text-muted-foreground">Selected</span>
        <button onClick={onClearSelection} className="text-xs text-muted-foreground hover:underline ml-2">Clear</button>
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={() => onAction('bulk_move_chapter')}
          className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-accent rounded-md transition-colors"
        >
          <Folder className="w-4 h-4 text-blue-500" /> Move
        </button>
        <button 
          onClick={() => onAction('bulk_ai_correction')}
          className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-accent rounded-md transition-colors"
        >
          <Brain className="w-4 h-4 text-purple-500" /> AI Verify
        </button>
        <button 
          onClick={() => onAction('bulk_translate')}
          className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-accent rounded-md transition-colors"
        >
          <Globe className="w-4 h-4 text-green-500" /> Translate
        </button>
        <button 
          onClick={() => onAction('bulk_delete')}
          className="flex items-center gap-2 text-sm px-3 py-1.5 hover:bg-accent rounded-md transition-colors"
        >
          <Trash2 className="w-4 h-4 text-destructive" /> Archive
        </button>
      </div>
    </div>
  )
}

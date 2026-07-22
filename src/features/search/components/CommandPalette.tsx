'use client'

import { useEffect, useState } from 'react'
import { Search, History } from 'lucide-react'
import { getSearchHistory } from '../api/saved-filters'

export function CommandPalette({ isOpen, onClose, onSelectQuery }: { isOpen: boolean, onClose: () => void, onSelectQuery: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const [history, setHistory] = useState<string[]>([])

  useEffect(() => {
    if (isOpen) {
      getSearchHistory().then(setHistory).catch(console.error)
    }
  }, [isOpen])

  // Handle Ctrl+K shortcut globally (requires a parent provider, mocked here for context)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        // toggle logic would be here
      }
    }
    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-background/80 backdrop-blur-sm">
      <div className="relative w-full max-w-xl bg-card border rounded-xl shadow-2xl overflow-hidden">
        
        {/* Search Input */}
        <div className="flex items-center px-4 py-3 border-b border-border">
          <Search className="w-5 h-5 text-muted-foreground mr-3" />
          <input 
            type="text" 
            autoFocus
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && query.trim()) {
                onSelectQuery(query)
                onClose()
              }
              if (e.key === 'Escape') onClose()
            }}
            placeholder="Search questions by text, ID, or LaTeX formula..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-base"
          />
          <button onClick={onClose} className="text-xs px-2 py-1 bg-muted rounded border hover:bg-accent">ESC</button>
        </div>

        {/* Recent History */}
        {!query && history.length > 0 && (
          <div className="p-2">
            <h4 className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent Searches</h4>
            <div className="space-y-1">
              {history.map((h, i) => (
                <button 
                  key={i}
                  onClick={() => { onSelectQuery(h); onClose() }}
                  className="w-full flex items-center px-3 py-2 text-sm rounded hover:bg-accent hover:text-accent-foreground transition-colors"
                >
                  <History className="w-4 h-4 mr-3 text-muted-foreground" />
                  {h}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Empty */}
        {!query && history.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No recent searches. Try searching for a specific topic or physics formula.
          </div>
        )}
      </div>
    </div>
  )
}

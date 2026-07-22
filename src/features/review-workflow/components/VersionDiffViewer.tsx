'use client'

import { ArrowRightLeft } from 'lucide-react'

interface VersionDiffProps {
  oldHtml: string
  newHtml: string
  versionNumber: number
}

/**
 * A specialized viewer that shows a side-by-side or inline comparison 
 * between two versions of a question (e.g. after a Reviewer rejected it and the Setter fixed it).
 */
export function VersionDiffViewer({ oldHtml, newHtml, versionNumber }: VersionDiffProps) {
  
  // In a real production app, we would use a library like 'diff' or 'htmldiff-js' 
  // to calculate the exact DOM differences and inject <ins> and <del> tags.
  // For presentation, this is a side-by-side layout.

  return (
    <div className="bg-card border rounded-xl shadow-sm overflow-hidden flex flex-col mt-6">
      <div className="p-4 border-b bg-muted/30 flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2">
          Version History <ArrowRightLeft className="w-4 h-4 text-muted-foreground" />
        </h3>
        <span className="text-sm text-muted-foreground">Comparing v{versionNumber - 1} against v{versionNumber}</span>
      </div>

      <div className="grid grid-cols-2 divide-x">
        
        {/* Old Version */}
        <div className="p-6 bg-red-50/30">
          <div className="text-xs font-bold text-red-600 uppercase tracking-wider mb-4 border-b border-red-100 pb-2">
            Previous Version (v{versionNumber - 1})
          </div>
          <div className="prose prose-sm max-w-none opacity-75" dangerouslySetInnerHTML={{ __html: oldHtml }} />
        </div>

        {/* New Version */}
        <div className="p-6 bg-green-50/30">
          <div className="text-xs font-bold text-green-600 uppercase tracking-wider mb-4 border-b border-green-100 pb-2">
            Updated Version (v{versionNumber})
          </div>
          <div className="prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: newHtml }} />
        </div>

      </div>
    </div>
  )
}

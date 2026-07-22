'use client'

import { DuplicateCheckResult } from '../api/duplicate-check'

interface ImportPreviewGridProps {
  data: DuplicateCheckResult[]
  onSave: () => void
  isSaving: boolean
}

export function ImportPreviewGrid({ data, onSave, isSaving }: ImportPreviewGridProps) {
  const duplicatesCount = data.filter(d => d.isDuplicate).length
  const validCount = data.length - duplicatesCount

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center bg-card p-4 rounded-lg border shadow-sm">
        <div>
          <h3 className="font-semibold text-lg">Import Preview</h3>
          <p className="text-sm text-muted-foreground">
            Found {data.length} total questions. 
            <span className="text-green-600 font-medium ml-2">{validCount} Ready</span>
            <span className="text-destructive font-medium ml-2">{duplicatesCount} Duplicates</span>
          </p>
        </div>
        <button
          onClick={onSave}
          disabled={isSaving || validCount === 0}
          className="px-4 py-2 bg-primary text-primary-foreground rounded-md shadow hover:bg-primary/90 disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : `Import ${validCount} Questions`}
        </button>
      </div>

      <div className="border rounded-lg overflow-hidden bg-card shadow-sm">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-16">Status</th>
              <th className="px-4 py-3">Question Content (AI Cleaned)</th>
              <th className="px-4 py-3 w-32">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {data.map((row, idx) => (
              <tr key={row.id || idx} className={row.isDuplicate ? 'bg-destructive/5' : 'hover:bg-accent/50'}>
                <td className="px-4 py-3">
                  {row.isDuplicate ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive">
                      Duplicate
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Valid
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 font-mono text-xs">{row.content}</td>
                <td className="px-4 py-3">
                  <button className="text-primary hover:underline">Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

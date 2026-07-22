'use client'

import { undoImport } from '../api/actions'

export function ImportHistory({ sessions }: { sessions: any[] }) {
  const handleUndo = async (id: string) => {
    if (confirm('Are you sure you want to completely undo this import? This will delete all associated questions permanently.')) {
      await undoImport(id)
      alert('Import undone successfully.')
      // in reality we'd mutate/refresh the data here
    }
  }

  return (
    <div className="bg-card border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Recent Imports</h3>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground uppercase text-xs">
          <tr>
            <th className="px-4 py-3">File Name</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Questions</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {sessions.map(session => (
            <tr key={session.id} className={session.status === 'undone' ? 'opacity-50 bg-muted' : 'hover:bg-accent/50'}>
              <td className="px-4 py-3 font-medium">{session.file_name}</td>
              <td className="px-4 py-3 capitalize">{session.status}</td>
              <td className="px-4 py-3">{session.total_items}</td>
              <td className="px-4 py-3">{new Date(session.created_at).toLocaleDateString()}</td>
              <td className="px-4 py-3">
                {session.status === 'completed' && (
                  <button 
                    onClick={() => handleUndo(session.id)}
                    className="text-destructive hover:underline text-xs font-semibold"
                  >
                    Undo Import
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

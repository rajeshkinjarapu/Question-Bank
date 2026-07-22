'use client'

import { useState } from 'react'
import { useQuestions } from '../hooks/useQuestions'
import { Search, Plus, Copy, Trash2, Edit } from 'lucide-react'

export function QuestionList() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const { questions, total, totalPages, isLoading, deleteQuestion, cloneQuestion, isMutating } = useQuestions({ page, limit: 10, search })

  if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading Question Bank...</div>

  return (
    <div className="bg-card border rounded-lg shadow-sm">
      {/* Toolbar */}
      <div className="p-4 border-b flex justify-between items-center gap-4 bg-muted/20">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search questions (LaTeX, Text)..." 
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
            className="w-full pl-9 pr-4 py-2 text-sm border rounded-md focus:ring-primary focus:border-primary"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90">
          <Plus className="w-4 h-4" /> Add Question
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted/50 text-muted-foreground uppercase text-xs">
            <tr>
              <th className="px-4 py-3 w-12">ID</th>
              <th className="px-4 py-3">Content Snippet</th>
              <th className="px-4 py-3 w-32">Type</th>
              <th className="px-4 py-3 w-24">Difficulty</th>
              <th className="px-4 py-3 w-32 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {questions.map((q: any) => (
              <tr key={q.id} className="hover:bg-accent/30 transition-colors group">
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{q.id.substring(0,6)}</td>
                <td className="px-4 py-3">
                  <div className="line-clamp-2 max-w-xl" dangerouslySetInnerHTML={{ __html: q.content }} />
                </td>
                <td className="px-4 py-3">
                  <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">{q.type?.name || 'MCQ'}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    q.difficulty?.name === 'Hard' ? 'bg-red-100 text-red-800' : 
                    q.difficulty?.name === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {q.difficulty?.name || 'Medium'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button title="Edit" className="text-muted-foreground hover:text-primary"><Edit className="w-4 h-4" /></button>
                  <button 
                    title="Clone" 
                    onClick={() => cloneQuestion(q.id)} 
                    disabled={isMutating}
                    className="text-muted-foreground hover:text-blue-600 disabled:opacity-50"
                  ><Copy className="w-4 h-4" /></button>
                  <button 
                    title="Delete" 
                    onClick={() => { if(confirm('Soft delete this question?')) deleteQuestion(q.id) }} 
                    disabled={isMutating}
                    className="text-muted-foreground hover:text-destructive disabled:opacity-50"
                  ><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}
            {questions.length === 0 && (
              <tr><td colSpan={5} className="p-8 text-center text-muted-foreground">No questions found matching criteria.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t flex justify-between items-center text-sm text-muted-foreground bg-muted/20">
        <span>Showing {questions.length} of {total} questions</span>
        <div className="flex gap-2">
          <button 
            disabled={page === 1} 
            onClick={() => setPage(p => p - 1)}
            className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
          >Prev</button>
          <span className="px-3 py-1 border rounded bg-background">Page {page} of {totalPages}</span>
          <button 
            disabled={page === totalPages || totalPages === 0} 
            onClick={() => setPage(p => p + 1)}
            className="px-3 py-1 border rounded hover:bg-accent disabled:opacity-50"
          >Next</button>
        </div>
      </div>
    </div>
  )
}

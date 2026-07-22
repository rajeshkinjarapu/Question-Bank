'use client'

import { SearchFilters } from '../types/filters'

interface AdvancedFiltersProps {
  filters: Partial<SearchFilters>
  updateFilter: (key: keyof SearchFilters, value: any) => void
  resetFilters: () => void
}

export function AdvancedFilters({ filters, updateFilter, resetFilters }: AdvancedFiltersProps) {
  return (
    <div className="w-64 shrink-0 bg-card border rounded-lg p-4 space-y-6 shadow-sm overflow-y-auto max-h-[80vh]">
      <div className="flex justify-between items-center border-b pb-2">
        <h3 className="font-semibold">Filters</h3>
        <button onClick={resetFilters} className="text-xs text-muted-foreground hover:text-primary">Reset All</button>
      </div>

      <div className="space-y-4">
        {/* Exam & Subject */}
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Exam</label>
          <select 
            value={filters.examId || ''} 
            onChange={e => updateFilter('examId', e.target.value)}
            className="w-full text-sm border rounded p-1.5 focus:ring-primary"
          >
            <option value="">All Exams</option>
            <option value="uuid-jee">JEE Main</option>
            <option value="uuid-neet">NEET</option>
          </select>
        </div>

        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-1 block">Difficulty</label>
          <select 
            value={filters.difficultyId || ''} 
            onChange={e => updateFilter('difficultyId', e.target.value)}
            className="w-full text-sm border rounded p-1.5 focus:ring-primary"
          >
            <option value="">Any</option>
            <option value="uuid-easy">Easy</option>
            <option value="uuid-med">Medium</option>
            <option value="uuid-hard">Hard</option>
          </select>
        </div>

        {/* Numerical Ranges */}
        <div className="pt-2 border-t">
          <label className="text-xs font-semibold uppercase text-muted-foreground mb-2 block">Marks</label>
          <div className="flex gap-2 items-center">
            <input 
              type="number" placeholder="Min" 
              className="w-full border rounded p-1 text-sm"
              value={filters.marksMin || ''}
              onChange={e => updateFilter('marksMin', Number(e.target.value) || undefined)}
            />
            <span className="text-muted-foreground">-</span>
            <input 
              type="number" placeholder="Max" 
              className="w-full border rounded p-1 text-sm"
              value={filters.marksMax || ''}
              onChange={e => updateFilter('marksMax', Number(e.target.value) || undefined)}
            />
          </div>
        </div>

        {/* Booleans & Settings */}
        <div className="pt-2 border-t space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filters.isFuzzy || false} 
              onChange={e => updateFilter('isFuzzy', e.target.checked)} 
              className="rounded text-primary focus:ring-primary"
            />
            <span className="text-sm">Enable Fuzzy Typo Search</span>
          </label>
        </div>

      </div>
    </div>
  )
}

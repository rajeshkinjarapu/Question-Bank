'use client'

import { useState } from 'react'
import { ArrowUpDown } from 'lucide-react'

interface Column {
  header: string
  accessor: string
  isNumeric?: boolean
}

interface DataGridProps {
  columns: Column[]
  data: any[]
}

export function DataGrid({ columns, data }: DataGridProps) {
  const [sortConfig, setSortConfig] = useState<{ key: string, direction: 'asc' | 'desc' } | null>(null)

  const sortedData = [...data].sort((a, b) => {
    if (!sortConfig) return 0
    const valA = a[sortConfig.key]
    const valB = b[sortConfig.key]
    if (valA < valB) return sortConfig.direction === 'asc' ? -1 : 1
    if (valA > valB) return sortConfig.direction === 'asc' ? 1 : -1
    return 0
  })

  const requestSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-muted text-muted-foreground">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                className={`p-4 font-semibold cursor-pointer hover:bg-muted/80 transition-colors ${col.isNumeric ? 'text-right' : ''}`}
                onClick={() => requestSort(col.accessor)}
              >
                <div className={`flex items-center gap-2 ${col.isNumeric ? 'justify-end' : ''}`}>
                  {col.header}
                  <ArrowUpDown className="w-3 h-3 opacity-50" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y">
          {sortedData.map((row, rIdx) => (
            <tr key={rIdx} className="hover:bg-muted/30 transition-colors">
              {columns.map((col, cIdx) => (
                <td key={cIdx} className={`p-4 ${col.isNumeric ? 'text-right font-medium' : ''}`}>
                  {row[col.accessor]}
                </td>
              ))}
            </tr>
          ))}
          {sortedData.length === 0 && (
            <tr>
              <td colSpan={columns.length} className="p-8 text-center text-muted-foreground">
                No data available for this report.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
